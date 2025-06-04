const express = require('express');
const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');
const ExcelJS = require('exceljs');
const { upload } = require('./uploadMiddleware');

const router = express.Router();

router.post('/', upload.single('file'), async (req, res) => {
  try {
    const dataBuffer = fs.readFileSync(req.file.path);
    const pdfData = await pdfParse(dataBuffer);

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Extracted PDF');

    const lines = pdfData.text.split('\n');
    lines.forEach((line) => {
      worksheet.addRow([line]);
    });

    const outputPath = req.file.path.replace('.pdf', '.xlsx');
    await workbook.xlsx.writeFile(outputPath);

    res.download(outputPath, 'converted.xlsx', () => {
      fs.unlinkSync(req.file.path);
      fs.unlinkSync(outputPath);
    });
  } catch (error) {
    console.error('❌ PDF to Excel error:', error);
    res.status(500).json({ error: 'Conversion failed' });
  }
});

module.exports = router;
