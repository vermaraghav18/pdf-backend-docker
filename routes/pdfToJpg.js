const express = require('express');
const router = express.Router();
const fs = require('fs');
const FormData = require('form-data');
const axios = require('axios');
const { uploadPDF } = require('./uploadMiddleware');


router.post('/', uploadPDF.single('pdf'), async (req, res) => {
  const filePath = req.file.path;
  const { dpi } = req.body;

  const formData = new FormData();
  formData.append('file', fs.createReadStream(filePath));
  formData.append('dpi', dpi || 150);

  try {
    const response = await axios.post('http://127.0.0.1:10007/', formData, {
      headers: formData.getHeaders(),
      responseType: 'stream',
    });

    res.setHeader('Content-Type', 'application/zip');
    response.data.pipe(res);
    response.data.on('end', () => fs.unlinkSync(filePath));
  } catch (err) {
    console.error('PDF to JPG failed:', err.message);
    res.status(500).json({ error: 'PDF to JPG conversion failed' });
  }
});

module.exports = router;
