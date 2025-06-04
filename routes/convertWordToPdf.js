const express = require('express');
const fs = require('fs');
const path = require('path');
const mammoth = require('mammoth');
const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');
const { upload } = require('./uploadMiddleware');

const router = express.Router();

router.post('/', upload.single('file'), async (req, res) => {
  const inputPath = req.file.path;
  const outputPath = inputPath.replace(/\.docx?$/, '.pdf');

  try {
    // Step 1: Extract text from Word doc
    const { value: extractedText } = await mammoth.extractRawText({ path: inputPath });

    if (!extractedText || extractedText.trim() === '') {
      return res.status(400).json({ error: 'The uploaded Word document has no readable text.' });
    }

    // Step 2: Create a simple PDF from extracted text
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const { width, height } = page.getSize();

    const fontSize = 12;
    const lines = extractedText.split('\n');
    let y = height - 50;

    for (const line of lines) {
      if (y < 50) {
        y = height - 50;
        pdfDoc.addPage();
      }
      page.drawText(line, {
        x: 50,
        y: y,
        size: fontSize,
        font: font,
        color: rgb(0, 0, 0),
      });
      y -= fontSize + 6;
    }

    const pdfBytes = await pdfDoc.save();
    fs.writeFileSync(outputPath, pdfBytes);

    res.download(outputPath, 'converted.pdf', () => {
      fs.unlinkSync(inputPath);
      fs.unlinkSync(outputPath);
    });
  } catch (err) {
    console.error('❌ Word to PDF error:', err);
    res.status(500).json({ error: 'Failed to convert Word to PDF' });
  }
});

module.exports = router;
