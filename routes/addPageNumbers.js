const express = require('express');
const fs = require('fs');
const path = require('path');
const { uploadPDF } = require('./uploadMiddleware');
const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');

const router = express.Router();

router.post('/', uploadPDF.single('file'), async (req, res)=> {
  try {
    const filePath = req.file.path;
    const pdfBytes = fs.readFileSync(filePath);
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const pages = pdfDoc.getPages();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

    pages.forEach((page, index) => {
      const { width, height } = page.getSize();
      page.drawText(`Page ${index + 1}`, {
        x: width - 80,
        y: 20,
        size: 10,
        font,
        color: rgb(0.5, 0.5, 0.5),
      });
    });

    const outputBytes = await pdfDoc.save();
    const outputPath = path.join('uploads', `numbered-${Date.now()}.pdf`);
    fs.writeFileSync(outputPath, outputBytes);

    res.download(outputPath, 'numbered.pdf', () => {
      fs.unlinkSync(filePath);
      fs.unlinkSync(outputPath);
    });
  } catch (err) {
    console.error('Add page numbers error:', err);
    res.status(500).json({ error: 'Failed to add page numbers' });
  }
});

module.exports = router;

