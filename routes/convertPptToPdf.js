// backend-only/routes/convertPptToPdf.js

const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const FormData = require('form-data');
require('dotenv').config();

const router = express.Router();
const upload = multer({ dest: '/tmp' });

router.post('/', upload.single('file'), async (req, res) => {
  const apiKey = process.env.CLOUDCONVERT_API_KEY;
  const originalName = req.file.originalname;
    const ext = path.extname(originalName).toLowerCase();
    const tmpPath = req.file.path;
    const filePath = tmpPath + ext;

fs.renameSync(tmpPath, filePath); // rename temp file to include extension

  if (!['.ppt', '.pptx'].includes(ext)) {
    fs.unlinkSync(filePath);
    return res.status(400).send('❌ Only .ppt or .pptx files are allowed');
  }

  try {
    // ✅ Step 1: Create job with 3 tasks: import → convert → export
    const jobResponse = await axios.post(
      'https://api.cloudconvert.com/v2/jobs',
      {
        tasks: {
          'upload-task': { operation: 'import/upload' },
          'convert-task': {
            operation: 'convert',
            input: 'upload-task',
            input_format: ext.slice(1),
            output_format: 'pdf',
            engine: 'office'
          },
          'export-task': {
            operation: 'export/url',
            input: 'convert-task'
          }
        }
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const jobId = jobResponse.data.data.id;
    const uploadTask = jobResponse.data.data.tasks.find(t => t.name === 'upload-task');
    const uploadUrl = uploadTask.result.form.url;
    const uploadParams = uploadTask.result.form.parameters;

    // ✅ Step 2: Upload file to CloudConvert
    const uploadForm = new FormData();
    Object.entries(uploadParams).forEach(([key, value]) => {
      uploadForm.append(key, value);
    });
    uploadForm.append('file', fs.createReadStream(filePath));

    await axios.post(uploadUrl, uploadForm, {
      headers: uploadForm.getHeaders(),
      maxContentLength: Infinity,
      maxBodyLength: Infinity
    });

    // ✅ Step 3: Poll job status until export task is done
    let fileUrl = null;
    let attempts = 0;
    while (attempts < 20) {
      const poll = await axios.get(
        `https://api.cloudconvert.com/v2/jobs/${jobId}`,
        {
          headers: {
            Authorization: `Bearer ${apiKey}`
          }
        }
      );

      const exportTask = poll.data.data.tasks.find(t => t.name === 'export-task');
      if (exportTask.status === 'finished') {
        fileUrl = exportTask.result.files[0].url;
        break;
      } else if (exportTask.status === 'error') {
        throw new Error('CloudConvert export task failed.');
      }

      await new Promise(resolve => setTimeout(resolve, 2000));
      attempts++;
    }

    if (!fileUrl) {
      throw new Error('❌ Conversion timed out.');
    }

    // ✅ Step 4: Stream final PDF back to client
    const downloadResponse = await axios.get(fileUrl, { responseType: 'stream' });
    res.setHeader('Content-Disposition', 'attachment; filename=converted.pdf');
    downloadResponse.data.pipe(res);

    // ✅ Cleanup
    fs.unlinkSync(filePath);
  } catch (err) {
    console.error('🔴 PPT to PDF Error:', err.response?.data || err.message);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    res.status(500).send('❌ PPT to PDF conversion failed');
  }
});

module.exports = router;
