const express = require('express');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { PDFDocument, degrees } = require('pdf-lib');
const { uploadPDF } = require('./uploadMiddleware'); // ✅ Use shared uploader

const router = express.Router();

router.post('/', uploadPDF.single('file'), async (req, res) => {
  try {
    const angle = parseInt(req.body.angle, 10); // ✅ Ensure integer and base 10
    if (isNaN(angle)) return res.status(400).send('❌ Invalid rotation angle');

    const filePath = req.file.path;
    const pdfBytes = fs.readFileSync(filePath);

    const pdfDoc = await PDFDocument.load(pdfBytes);
    const pages = pdfDoc.getPages();
    pages.forEach((page) => page.setRotation(degrees(angle)));

    const rotatedBytes = await pdfDoc.save();
    const outputPath = path.join(os.tmpdir(), `rotated-${Date.now()}.pdf`);
    fs.writeFileSync(outputPath, rotatedBytes);

    res.download(outputPath, () => {
      fs.unlinkSync(filePath);
      fs.unlinkSync(outputPath);
    });
  } catch (err) {
    console.error('Rotate PDF Error:', err);
    res.status(500).send('❌ Failed to rotate PDF');
  }
});

module.exports = router;
