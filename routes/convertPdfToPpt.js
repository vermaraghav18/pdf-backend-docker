const express = require('express');
const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');
const pptxgen = require('pptxgenjs');
const { uploadPDF } = require('./uploadMiddleware'); // ✅ Use shared middleware

const router = express.Router();

router.post('/', uploadPDF.single('file'), async (req, res) => {
  try {
    const filePath = req.file.path; // ✅ Use multer's path
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
    const outPath = path.join(path.dirname(filePath), `converted-${Date.now()}.pptx`);
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
