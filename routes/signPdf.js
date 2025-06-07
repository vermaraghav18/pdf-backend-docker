const express = require('express');
const router = express.Router();
const fs = require('fs');
const FormData = require('form-data');
const axios = require('axios');
const { uploadPDF } = require('./uploadMiddleware'); // ✅ Use shared middleware

router.post('/', uploadPDF.single('file'), async (req, res) => {
  const filePath = req.file.path;
  const { method, text, x, y, page, opacity } = req.body; // ✅ Include opacity if used

  const formData = new FormData();
  formData.append('file', fs.createReadStream(filePath));
  formData.append('method', method);
  formData.append('text', text);
  formData.append('x', x);
  formData.append('y', y);
  formData.append('page', page);
  if (opacity) formData.append('opacity', opacity); // Optional

  try {
    const response = await axios.post('http://127.0.0.1:10005/', formData, {
      headers: formData.getHeaders(),
      responseType: 'stream',
    });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=signed.pdf');
    response.data.pipe(res);

    response.data.on('end', () => fs.unlinkSync(filePath));
  } catch (err) {
    console.error('❌ Sign PDF failed:', err.message);
    res.status(500).send('Failed to sign PDF');
  }
});

module.exports = router;
