const express = require('express');
const router = express.Router();
const fs = require('fs');
const axios = require('axios');
const FormData = require('form-data');
const multer = require('multer');
const path = require('path');

const upload = multer({ dest: 'uploads/' });

router.post('/', upload.array('files'), async (req, res) => {
  const formData = new FormData();

  req.files.forEach((file) => {
    formData.append('files', fs.createReadStream(file.path), file.originalname);
  });

  try {
    const response = await axios.post('http://127.0.0.1:10008/', formData, {
      headers: formData.getHeaders(),
      responseType: 'stream',
    });

    res.setHeader('Content-Disposition', 'attachment; filename=merged.pdf');
    res.setHeader('Content-Type', 'application/pdf');

    response.data.pipe(res);
    response.data.on('end', () => {
      req.files.forEach((file) => fs.unlinkSync(file.path));
    });
  } catch (err) {
    console.error('JPG to PDF failed:', err.message);
    res.status(500).json({ error: 'JPG to PDF conversion failed' });
  }
});

module.exports = router;
