const express = require('express');
const fs = require('fs');
const path = require('path');
const os = require('os');
const { PDFDocument } = require('pdf-lib');
const { uploadPDF } = require('./uploadMiddleware');

const router = express.Router();

router.post('/', uploadPDF.array('pdfs', 2), async (req, res) => {
  try {
    const [file1, file2] = req.files;

    const pdfDoc = await PDFDocument.create();

    for (let file of [file1, file2]) {
      const existingPdfBytes = fs.readFileSync(file.path);
      const donorPdfDoc = await PDFDocument.load(existingPdfBytes);
      const copiedPages = await pdfDoc.copyPages(donorPdfDoc, donorPdfDoc.getPageIndices());
      copiedPages.forEach((page) => pdfDoc.addPage(page));
    }

    const outputPath = path.join(os.tmpdir(), `merged-${Date.now()}.pdf`);
    const pdfBytes = await pdfDoc.save();
    fs.writeFileSync(outputPath, pdfBytes);

    // ✅ Stream the file for Render compatibility
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=merged.pdf');

    const readStream = fs.createReadStream(outputPath);
    readStream.pipe(res);

    readStream.on('close', () => {
      try {
        fs.unlinkSync(file1.path);
        fs.unlinkSync(file2.path);
        fs.unlinkSync(outputPath);
      } catch (cleanupErr) {
        console.warn('Cleanup warning:', cleanupErr.message);
      }
    });

    readStream.on('error', (err) => {
      console.error('Streaming error:', err.message);
      res.status(500).send('❌ Error streaming merged PDF');
    });

  } catch (err) {
    console.error('Merge error:', err);
    res.status(500).send('❌ Failed to merge PDFs');
  }
});

module.exports = router;
