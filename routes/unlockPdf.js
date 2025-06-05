const express = require('express');
const router = express.Router();
const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');
const { upload } = require('./uploadMiddleware'); // adjust if path is different

router.post('/', upload.single('file'), async (req, res) => {
  try {
    const filePath = req.file.path;
    const password = req.body.password;

    const formData = new FormData();
    formData.append('file', fs.createReadStream(filePath));
    formData.append('password', password);

    const response = await axios.post('http://localhost:10003/', formData, {
      headers: formData.getHeaders(),
      responseType: 'stream',
    });

    res.setHeader('Content-Type', 'application/pdf');
    response.data.pipe(res);

    response.data.on('end', () => {
      fs.unlinkSync(filePath);
    });
  } catch (err) {
    console.error('Unlock PDF Error:', err.message);
    res.status(500).send('Failed to unlock PDF');
  }
});

module.exports = router;
