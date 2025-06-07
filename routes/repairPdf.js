const express = require('express');
const fs = require('fs');
const path = require('path');
const { uploadPDF } = require('./uploadMiddleware'); // ✅ Correct named uploader
const { PDFDocument } = require('pdf-lib');

const router = express.Router();

router.post('/', uploadPDF.single('pdf'), async (req, res) => {
  try {
    const filePath = req.file.path;
    const bytes = fs.readFileSync(filePath);
    const pdfDoc = await PDFDocument.load(bytes, { ignoreEncryption: true });
    const repairedBytes = await pdfDoc.save();

    // ✅ Use /tmp for output
    const outputPath = path.join('/tmp', `repaired-${Date.now()}.pdf`);
    fs.writeFileSync(outputPath, repairedBytes);

    res.download(outputPath, 'repaired.pdf', () => {
      fs.unlinkSync(filePath);
      fs.unlinkSync(outputPath);
    });
  } catch (err) {
    console.error('Repair error:', err);
    res.status(500).json({ error: 'Failed to repair PDF' });
  }
});

module.exports = router;
