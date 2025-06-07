const express = require('express');
const fs = require('fs');
const path = require('path');
const { PDFDocument, degrees } = require('pdf-lib');
const { uploadPDF } = require('./uploadMiddleware');


const router = express.Router();

router.post('/', uploadPDF.single('pdf'), async (req, res) => {
  try {
    const filePath = req.file.path;
    const operations = JSON.parse(req.body.operations || '[]'); // Optional JSON array

    const existingPdfBytes = fs.readFileSync(filePath);
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const newPdf = await PDFDocument.create();

    for (const op of operations) {
      const { type, pageIndex, rotate, times, insertIndex } = op;

      if (type === 'delete') {
        continue; // Skip adding this page
      }

      const [copiedPage] = await newPdf.copyPages(pdfDoc, [pageIndex]);

      if (type === 'rotate') {
        copiedPage.setRotation(degrees(rotate || 90));
      }

      if (type === 'duplicate') {
        for (let i = 0; i < (times || 2); i++) {
          const [dupPage] = await newPdf.copyPages(pdfDoc, [pageIndex]);
          newPdf.addPage(dupPage);
        }
        continue;
      }

      // Default: add page as-is
      newPdf.addPage(copiedPage);
    }

    const finalPdfBytes = await newPdf.save();
    const outputPath = path.join('uploads', `organized-${Date.now()}.pdf`);
    fs.writeFileSync(outputPath, finalPdfBytes);

    res.download(outputPath, 'organized.pdf', () => {
      fs.unlinkSync(filePath);
      fs.unlinkSync(outputPath);
    });
  } catch (err) {
    console.error('Organize PDF error:', err);
    res.status(500).json({ error: 'Failed to organize PDF' });
  }
});

module.exports = router;
