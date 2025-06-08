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
  const fileName = path.basename(filePath);
  const apiKey = process.env.CLOUDCONVERT_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'CloudConvert API key not set in .env' });
  }

  try {
    // Step 1: Upload file to CloudConvert import task
    const importTask = await axios.post('https://api.cloudconvert.com/v2/import/upload', {
      name: 'import-my-excel'
    }, {
      headers: { Authorization: `Bearer ${apiKey}` }
    });

    const uploadUrl = importTask.data.data.result.form.url;
    const uploadParams = importTask.data.data.result.form.parameters;

    // Step 2: Upload Excel file to CloudConvert
    const form = new FormData();
    Object.entries(uploadParams).forEach(([key, val]) => form.append(key, val));
    form.append('file', fs.createReadStream(filePath));

    await axios.post(uploadUrl, form, {
      headers: form.getHeaders()
    });

    // Step 3: Create convert task
    const convertTask = await axios.post('https://api.cloudconvert.com/v2/convert', {
      input_format: 'xlsx',
      output_format: 'pdf',
      engine: 'libreoffice',
      input: 'upload',
      file: importTask.data.data.id, // use import task ID, not uploadParams.key

    }, {
      headers: { Authorization: `Bearer ${apiKey}` }
    });

    const taskId = convertTask.data.data.id;

    // Step 4: Poll for task completion
    let convertedFileUrl = null;
    for (let i = 0; i < 10; i++) {
      await new Promise(resolve => setTimeout(resolve, 2000));
      const statusCheck = await axios.get(`https://api.cloudconvert.com/v2/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${apiKey}` }
      });

      const taskData = statusCheck.data.data;
      if (taskData.status === 'finished' && taskData.result?.files?.[0]?.url) {
        convertedFileUrl = taskData.result.files[0].url;
        break;
      }
    }

    if (!convertedFileUrl) {
      return res.status(500).json({ error: 'Conversion failed or timed out.' });
    }

    // Step 5: Stream the converted PDF to response
    const pdfResponse = await axios.get(convertedFileUrl, { responseType: 'stream' });
    res.setHeader('Content-Disposition', 'attachment; filename=converted.pdf');
    pdfResponse.data.pipe(res);

  } catch (err) {
    console.error('🔴 CloudConvert Excel → PDF error:', err.message);
    res.status(500).json({ error: 'Conversion failed. ' + err.message });
  } finally {
    fs.unlinkSync(filePath); // Clean temp file
  }
});

module.exports = router;
