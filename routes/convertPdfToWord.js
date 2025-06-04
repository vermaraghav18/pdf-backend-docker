const express = require('express');
const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');
const { Document, Packer, Paragraph } = require('docx');
const upload = require('./uploadMiddleware');

const router = express.Router();

router.post('/', upload.single('file'), async (req, res) => {
  const inputPath = req.file.path;
  const outputPath = inputPath.replace('.pdf', '.docx');

  try {
    const dataBuffer = fs.readFileSync(inputPath);
    const data = await pdfParse(dataBuffer);

    if (!data.text || data.text.trim() === "") {
      return res.status(400).json({ error: "PDF has no readable text to convert." });
    }

    const lines = data.text.split('\n').map(line => new Paragraph(line.trim()));

    const doc = new Document({
      sections: [{ children: lines }]
    });

    const buffer = await Packer.toBuffer(doc);
    fs.writeFileSync(outputPath, buffer);

    res.download(outputPath, 'converted.docx', () => {
      fs.unlinkSync(inputPath);
      fs.unlinkSync(outputPath);
    });
  } catch (error) {
    console.error("❌ PDF to Word conversion error:", error);
    res.status(500).json({ error: "Failed to convert PDF to Word." });
  }
});

module.exports = router;
