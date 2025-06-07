const express = require('express');
const router = express.Router();
const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');
const { upload } = require('./uploadMiddleware');

router.post('/', upload.single('file'), async (req, res) => {
  try {
    const filePath = req.file.path;
    const { password } = req.body;

    if (!fs.existsSync(filePath)) {
      return res.status(400).send('Uploaded file not found');
    }

    const formData = new FormData();
    formData.append('file', fs.createReadStream(filePath));
    formData.append('password', password);

    const response = await axios.post('http://127.0.0.1:10002/', formData, {
      headers: formData.getHeaders(),
      responseType: 'stream',
    });

    res.setHeader('Content-Type', 'application/pdf');
    response.data.pipe(res);

    // ✅ Safer cleanup after response ends
    res.on('finish', () => {
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    });

  } catch (err) {
    console.error('Protect PDF Error:', err);
    res.status(500).send('Failed to protect PDF');
  }
});

module.exports = router;
