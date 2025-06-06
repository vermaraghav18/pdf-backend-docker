const express = require('express');
const fs = require('fs');
const path = require('path');
const ExcelJS = require('exceljs');
const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');
const { upload } = require('./uploadMiddleware');

const router = express.Router();

router.post('/', upload.single('file'), async (req, res) => {
  const inputPath = req.file.path;
  const outputPath = inputPath.replace(/\.(xls|xlsx)$/, '.pdf');

  try {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(inputPath);
    const worksheet = workbook.worksheets[0];

    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595, 842]); // A4
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const { height } = page.getSize();

    let y = height - 50;

    worksheet.eachRow((row) => {
      const rowText = row.values
        .filter((v) => typeof v === 'string' || typeof v === 'number')
        .join(' | ');

      if (y < 50) {
        y = height - 50;
        pdfDoc.addPage(); // add new page if overflow
      }

      page.drawText(rowText, {
        x: 50,
        y,
        size: 12,
        font,
        color: rgb(0, 0, 0),
      });

      y -= 20;
    });

    const pdfBytes = await pdfDoc.save();
    fs.writeFileSync(outputPath, pdfBytes);

    res.download(outputPath, 'converted.pdf', () => {
      fs.unlinkSync(inputPath);
      fs.unlinkSync(outputPath);
    });
  } catch (error) {
    console.error('❌ Excel to PDF error:', error);
    res.status(500).json({ error: 'Conversion failed' });
  }
});

module.exports = router;
