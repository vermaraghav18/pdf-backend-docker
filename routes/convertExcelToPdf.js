// routes/convertExcelToPdf.js
const express = require('express');
const fs = require('fs');
const FormData = require('form-data');
const axios = require('axios');
const { uploadExcel } = require('./uploadMiddleware');
require('dotenv').config();

const router = express.Router();

router.post('/', uploadExcel.single('file'), async (req, res) => {
  const microserviceUrl = process.env.EXCEL_TO_PDF_MICROSERVICE_URL;
  const filePath = req.file.path;

  if (!microserviceUrl) {
    return res.status(500).send('❌ Microservice URL not configured.');
  }

  try {
    const formData = new FormData();
    formData.append('file', fs.createReadStream(filePath));

    const response = await axios.post(`${microserviceUrl}/`, formData, {
      headers: formData.getHeaders(),
      responseType: 'stream',
    });

    res.setHeader('Content-Disposition', 'attachment; filename=converted.pdf');
    response.data.pipe(res);
  } catch (err) {
    console.error('❌ Microservice error:', err.message);
    res.status(500).send('❌ Conversion failed via microservice.');
  } finally {
    // Always clean up temp file
    fs.unlink(filePath, () => {});
  }
});

module.exports = router;
