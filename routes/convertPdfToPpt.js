const express = require('express');
const fs = require('fs');
const os = require('os');
const path = require('path');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const pptxgen = require('pptxgenjs');

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, os.tmpdir()),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

router.post('/', upload.single('file'), async (req, res) => {
  try {
    const filePath = path.join(os.tmpdir(), req.file.filename);
    const pdfBuffer = fs.readFileSync(filePath);
    const pdfData = await pdfParse(pdfBuffer);

    const pptx = new pptxgen();
    const lines = pdfData.text.split('\n');
    const linesPerSlide = 10;

    for (let i = 0; i < lines.length; i += linesPerSlide) {
      const slide = pptx.addSlide();
      const chunk = lines.slice(i, i + linesPerSlide).join('\n');
      slide.addText(chunk, { x: 0.5, y: 0.5, w: '90%', h: '90%' });
    }

    const pptxBuffer = await pptx.write('nodebuffer');
    const outPath = path.join(os.tmpdir(), `converted-${Date.now()}.pptx`);
    fs.writeFileSync(outPath, pptxBuffer);

    res.download(outPath, () => {
      fs.unlinkSync(filePath);
      fs.unlinkSync(outPath);
    });
  } catch (err) {
    console.error('PDF to PPT Error:', err);
    res.status(500).send('❌ Failed to convert PDF to PowerPoint');
  }
});

module.exports = router;
