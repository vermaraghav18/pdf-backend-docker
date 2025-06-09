const express = require('express');
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');
const axios = require('axios');
const { uploadExcel } = require('./uploadMiddleware');
require('dotenv').config();

const router = express.Router();

router.post('/', uploadExcel.single('file'), async (req, res) => {
  const filePath = req.file.path;
  const apiKey = process.env.CLOUDCONVERT_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'CloudConvert API key is missing in .env' });
  }

  try {
    // 🔹 Step 1: Create a job
    const jobRes = await axios.post(
      'https://api.cloudconvert.com/v2/jobs',
      {
        tasks: {
          'import-my-file': { operation: 'import/upload' },
          'convert-my-file': {
            operation: 'convert',
            input: 'import-my-file',
            input_format: 'xlsx',
            output_format: 'pdf',
            engine: 'office'
          },
          'export-my-file': {
            operation: 'export/url',
            input: 'convert-my-file'
          }
        }
      },
      { headers: { Authorization: `Bearer ${apiKey}` } }
    );

    const jobId = jobRes.data.data.id;
    const importTask = jobRes.data.data.tasks.find(t => t.name === 'import-my-file');
    const uploadUrl = importTask.result.form.url;
    const uploadParams = importTask.result.form.parameters;

    // 🔹 Step 2: Upload Excel file
    const form = new FormData();
    Object.entries(uploadParams).forEach(([key, value]) => form.append(key, value));
    form.append('file', fs.createReadStream(filePath));

    await axios.post(uploadUrl, form, {
      headers: form.getHeaders(),
      maxBodyLength: Infinity,
      maxContentLength: Infinity
    });

    // 🔹 Step 3: Poll job status
    let exportedFileUrl = null;
    for (let i = 0; i < 10; i++) {
      await new Promise(resolve => setTimeout(resolve, 3000));

      const pollRes = await axios.get(`https://api.cloudconvert.com/v2/jobs/${jobId}`, {
        headers: { Authorization: `Bearer ${apiKey}` }
      });

      const exportTask = pollRes.data.data.tasks.find(t => t.name === 'export-my-file');

      if (exportTask.status === 'finished' && exportTask.result?.files?.[0]?.url) {
        exportedFileUrl = exportTask.result.files[0].url;
        break;
      }

      if (exportTask.status === 'error') {
        throw new Error('❌ CloudConvert export task failed.');
      }
    }

    if (!exportedFileUrl) {
      return res.status(500).json({ error: 'Conversion timed out or failed.' });
    }

    // 🔹 Step 4: Stream PDF response
    const fileStream = await axios.get(exportedFileUrl, { responseType: 'stream' });
    res.setHeader('Content-Disposition', 'attachment; filename=converted.pdf');
    fileStream.data.pipe(res);
  } catch (err) {
    console.error('🔴 Excel to PDF Error:', err.response?.data || err.message);
    res.status(500).json({ error: '❌ Conversion failed.' });
  } finally {
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  }
});

module.exports = router;
