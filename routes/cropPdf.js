const express = require('express');
const router = express.Router();
const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');
const { upload } = require('./uploadMiddleware');

router.post('/', upload.single('file'), async (req, res) => {
  try {
    const filePath = req.file.path; // ✅ Correct path
    const {
  top_percent,
  bottom_percent,
  left_percent,
  right_percent
} = req.body;


    const formData = new FormData();
    formData.append('file', fs.createReadStream(filePath));
formData.append('top_percent', top_percent);
formData.append('bottom_percent', bottom_percent);
formData.append('left_percent', left_percent);
formData.append('right_percent', right_percent);


    const response = await axios.post('http://127.0.0.1:10004/', formData, {
      headers: formData.getHeaders(),
      responseType: 'stream',
    });

    res.setHeader('Content-Type', 'application/pdf');
    response.data.pipe(res);

    response.data.on('end', () => {
      fs.unlinkSync(filePath);
    });
  } catch (err) {
    console.error('Crop PDF Error:', err.message);
    res.status(500).send('Failed to crop PDF');
  }
});

module.exports = router;
