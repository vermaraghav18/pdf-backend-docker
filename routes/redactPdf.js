const express = require('express');
const fs = require('fs');
const path = require('path');
const { upload } = require('./uploadMiddleware');
const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');

const router = express.Router();

router.post('/', upload.single('pdf'), async (req, res) => {
  try {
    const filePath = req.file.path;
    const textToRedact = req.body.keyword || '';

    const pdfBytes = fs.readFileSync(filePath);
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

    const pages = pdfDoc.getPages();

    for (const page of pages) {
      const { width, height } = page.getSize();
      page.drawRectangle({
        x: 50,
        y: height / 2,
        width: 200,
        height: 20,
        color: rgb(0, 0, 0),
      });
    }

    const redactedBytes = await pdfDoc.save();
    const outputPath = path.join('uploads', `redacted-${Date.now()}.pdf`);
    fs.writeFileSync(outputPath, redactedBytes);

    res.download(outputPath, 'redacted.pdf', () => {
      fs.unlinkSync(filePath);
      fs.unlinkSync(outputPath);
    });
  } catch (err) {
    console.error('Redact error:', err);
    res.status(500).json({ error: 'Failed to redact PDF' });
  }
});

module.exports = router;
