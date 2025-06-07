    const express = require('express');
const fs = require('fs');
const FormData = require('form-data');
const axios = require('axios');
const { upload } = require('./uploadMiddleware');
const router = express.Router();

router.post('/', upload.single('file'), async (req, res) => {
  const filePath = req.file.path;

  const formData = new FormData();
  formData.append('file', fs.createReadStream(filePath));

  try {
    const response = await axios.post('http://localhost:10010/', formData, {
      headers: formData.getHeaders(),
      responseType: 'stream',
    });

    res.setHeader('Content-Disposition', 'attachment; filename=converted.pdf');
    response.data.pipe(res);
  } catch (error) {
    console.error('🔴 Error calling word-to-pdf microservice:', error.message);
    res.status(500).json({ error: 'Conversion failed' });
  } finally {
    fs.unlinkSync(filePath);
  }
});

module.exports = router;
