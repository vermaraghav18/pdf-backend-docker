const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { PDFDocument } = require('pdf-lib');

const router = express.Router();
const upload = multer({ dest: '/tmp' });

router.post('/', upload.single('file'), async (req, res) => {
  const inputPath = req.file.path;
  const ext = path.extname(req.file.originalname).toLowerCase();

  // ✅ Validate file
  if (ext !== '.pdf') {
    fs.unlinkSync(inputPath);
    return res.status(400).send('❌ Only PDF files are supported');
  }

  // ✅ Parse crop percentages
  const topPct = parseFloat(req.body.top) || 0;
  const bottomPct = parseFloat(req.body.bottom) || 0;
  const leftPct = parseFloat(req.body.left) || 0;
  const rightPct = parseFloat(req.body.right) || 0;

  try {
    const inputBytes = fs.readFileSync(inputPath);
    const pdfDoc = await PDFDocument.load(inputBytes);

    const pages = pdfDoc.getPages();
    for (const page of pages) {
      const { width, height } = page.getSize();

      const left = (leftPct / 100) * width;
      const right = width - (rightPct / 100) * width;
      const bottom = (bottomPct / 100) * height;
      const top = height - (topPct / 100) * height;

      page.setCropBox(left, bottom, right - left, top - bottom);
    }

    const croppedBytes = await pdfDoc.save();
    res.setHeader('Content-Disposition', 'attachment; filename=cropped.pdf');
    res.contentType('application/pdf');
    res.send(croppedBytes);

    fs.unlinkSync(inputPath);
  } catch (err) {
    console.error('🔴 Crop PDF Error:', err.message);
    if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
    res.status(500).send('❌ Failed to crop PDF');
  }
});

module.exports = router;
