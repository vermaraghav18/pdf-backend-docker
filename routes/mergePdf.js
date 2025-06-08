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

    const outputPath = path.join(os.tmpdir(), `merged-${Date.now()}.pdf`); // ✅ OS-safe path
    fs.writeFileSync(outputPath, await pdfDoc.save());

    res.download(outputPath, (err) => {
      if (err) {
        console.error('Download error:', err);
        return res.status(500).send('❌ Error sending merged PDF');
      }

      try {
        fs.unlinkSync(file1.path);
        fs.unlinkSync(file2.path);
        fs.unlinkSync(outputPath);
      } catch (cleanupErr) {
        console.warn('Cleanup failed:', cleanupErr.message);
      }
    });
  } catch (err) {
    console.error('Merge error:', err);
    res.status(500).send('❌ Failed to merge PDFs');
  }
});

module.exports = router;
