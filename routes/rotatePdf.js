const express = require('express');
const fs = require('fs');
const os = require('os');
const path = require('path');
const multer = require('multer');
const { PDFDocument, degrees } = require('pdf-lib');

const router = express.Router();

// ✅ Use OS temp directory
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, os.tmpdir()),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

router.post('/', upload.single('file'), async (req, res) => {
  try {
    const angle = parseInt(req.body.angle); // 🔥 Ensure integer
    const filePath = path.join(os.tmpdir(), req.file.filename);
    const pdfBytes = fs.readFileSync(filePath);

    const pdfDoc = await PDFDocument.load(pdfBytes);
    const pages = pdfDoc.getPages();

    pages.forEach((page) => {
      page.setRotation(degrees(angle)); // ✅ Use pdf-lib degrees()
    });

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
