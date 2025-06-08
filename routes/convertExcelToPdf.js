const express = require('express');
const fs = require('fs');
const FormData = require('form-data');
const axios = require('axios');
const { uploadExcel } = require('./uploadMiddleware');

const router = express.Router();

router.post('/', uploadExcel.single('file'), async (req, res) => {
  const filePath = req.file.path;

  const formData = new FormData();
  formData.append('file', fs.createReadStream(filePath));

  try {
    const response = await axios.post(
  `${process.env.EXCEL_TO_PDF_MICROSERVICE_URL || 'http://0.0.0.0:10012'}`,
  formData,
  {
    headers: formData.getHeaders(),
    responseType: 'stream',
  }
);


    res.setHeader('Content-Disposition', 'attachment; filename=converted.pdf');
    response.data.pipe(res);
  } catch (error) {
    console.error('🔴 Microservice Excel → PDF error:', error.message);
    res.status(500).json({ error: 'Conversion failed' });
  } finally {
    fs.unlinkSync(filePath);
  }
});

module.exports = router;
