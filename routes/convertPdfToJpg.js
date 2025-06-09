const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');
const axios = require('axios');
require('dotenv').config();

const router = express.Router();
const upload = multer({ dest: '/tmp' });

router.post('/', upload.single('file'), async (req, res) => {
  const inputPath = req.file.path;
  const ext = path.extname(req.file.originalname).toLowerCase();
  const apiKey = process.env.CLOUDCONVERT_API_KEY;

  if (ext !== '.pdf') {
    fs.unlinkSync(inputPath);
    return res.status(400).send('❌ Only PDF files are supported');
  }

  try {
    // ✅ Step 1: Create CloudConvert job for pdf → jpg
    const jobResponse = await axios.post('https://api.cloudconvert.com/v2/jobs', {
      tasks: {
        'import-task': { operation: 'import/upload' },
        'convert-task': {
          operation: 'convert',
          input: 'import-task',
          input_format: 'pdf',
          output_format: 'jpg',
          page_range: '',
          engine: 'office'
        },
        'export-task': {
          operation: 'export/url',
          input: 'convert-task'
        }
      }
    }, {
      headers: { Authorization: `Bearer ${apiKey}` }
    });

    const jobId = jobResponse.data.data.id;
    const uploadTask = jobResponse.data.data.tasks.find(t => t.name === 'import-task');
    const uploadUrl = uploadTask.result.form.url;
    const uploadParams = uploadTask.result.form.parameters;

    // ✅ Step 2: Upload PDF
    const form = new FormData();
    Object.entries(uploadParams).forEach(([key, value]) => {
      form.append(key, value);
    });
    form.append('file', fs.createReadStream(inputPath));

    await axios.post(uploadUrl, form, {
      headers: form.getHeaders(),
      maxContentLength: Infinity,
      maxBodyLength: Infinity
    });

    // ✅ Step 3: Poll until export task is done
    let jpgUrls = [];
    let attempts = 0;
    while (attempts < 20) {
      const poll = await axios.get(`https://api.cloudconvert.com/v2/jobs/${jobId}`, {
        headers: { Authorization: `Bearer ${apiKey}` }
      });

      const exportTask = poll.data.data.tasks.find(t => t.name === 'export-task');
      if (exportTask.status === 'finished') {
        jpgUrls = exportTask.result.files.map(f => f.url);
        break;
      }

      if (exportTask.status === 'error') {
        throw new Error('CloudConvert JPG export failed');
      }

      await new Promise(resolve => setTimeout(resolve, 2000));
      attempts++;
    }

    if (jpgUrls.length === 0) throw new Error('❌ Conversion timed out');

    // ✅ Step 4: Send JSON with all downloadable JPG links
    res.json({
      message: `✅ Converted ${jpgUrls.length} pages`,
      images: jpgUrls
    });

    fs.unlinkSync(inputPath);
  } catch (err) {
    console.error('🔴 PDF to JPG Error:', err.response?.data || err.message);
    if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
    res.status(500).send('❌ PDF to JPG conversion failed');
  }
});

module.exports = router;
