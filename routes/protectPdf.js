const express = require('express');
const router = express.Router();
const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');
const { upload } = require('./uploadMiddleware');


router.post('/', upload.single('file'), async (req, res) => {
  try {
    const filePath = req.file.path;
    const password = req.body.password;

    const formData = new FormData();
    formData.append('file', fs.createReadStream(filePath));
    formData.append('password', password);

    // ✅ Change port if protect microservice runs on 10002
    const response = await axios.post('http://localhost:10002/', formData, {
      headers: formData.getHeaders(),
      responseType: 'stream',
    });

    // Pipe protected PDF back to frontend
    res.setHeader('Content-Type', 'application/pdf');
    response.data.pipe(res);

    // Cleanup
    response.data.on('end', () => {
      fs.unlinkSync(filePath);
    });
  } catch (err) {
    console.error('Protect PDF Error:', err.message);
    res.status(500).send('Failed to protect PDF.');
  }
});

module.exports = router;
