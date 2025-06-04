const express = require('express');
const fs = require('fs');
const path = require('path');
const ExcelJS = require('exceljs');
const { PDFDocument, rgb } = require('pdf-lib');
const { upload } = require('./uploadMiddleware');

const router = express.Router();

router.post('/', upload.single('file'), async (req, res) => {
  try {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(req.file.path);
    const worksheet = workbook.worksheets[0];

    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595, 842]); // A4 size
    const { height } = page.getSize();

    const rows = worksheet.getSheetValues().slice(1); // skip first metadata row
    let y = height - 50;
    for (let row of rows) {
      const text = row?.filter(Boolean).join(' | ') || '';
      page.drawText(text, { x: 50, y, size: 12, color: rgb(0, 0, 0) });
      y -= 20;
    }

    const pdfBytes = await pdfDoc.save();
    const outputPath = req.file.path.replace('.xlsx', '.pdf');
    fs.writeFileSync(outputPath, pdfBytes);

    res.download(outputPath, 'converted.pdf', () => {
      fs.unlinkSync(req.file.path);
      fs.unlinkSync(outputPath);
    });
  } catch (error) {
    console.error('❌ Excel to PDF error:', error);
    res.status(500).json({ error: 'Conversion failed' });
  }
});

module.exports = router;
