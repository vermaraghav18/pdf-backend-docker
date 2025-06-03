// routes/mergePdf.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const { PDFDocument } = require('pdf-lib');

const router = express.Router();

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, '/tmp'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});

const upload = multer({ storage });

router.post('/', upload.array('pdfs', 2), async (req, res) => {
  try {
    const [file1, file2] = req.files;

    const pdfDoc = await PDFDocument.create();

    for (let file of [file1, file2]) {
      const existingPdfBytes = fs.readFileSync(file.path);
      const donorPdfDoc = await PDFDocument.load(existingPdfBytes);
      const copiedPages = await pdfDoc.copyPages(donorPdfDoc, donorPdfDoc.getPageIndices());
      copiedPages.forEach((page) => pdfDoc.addPage(page));
    }

    const mergedPdfBytes = await pdfDoc.save();

    const outputPath = path.join('uploads', `merged-${Date.now()}.pdf`);
    fs.writeFileSync(outputPath, mergedPdfBytes);

    res.download(outputPath, () => {
      fs.unlinkSync(file1.path);
      fs.unlinkSync(file2.path);
      fs.unlinkSync(outputPath);
    });
  } catch (err) {
    console.error('Merge error:', err);
    res.status(500).send('❌ Failed to merge PDFs');
  }
});

module.exports = router;
