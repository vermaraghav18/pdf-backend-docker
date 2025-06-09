const express = require('express');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const { uploadExcel } = require('./uploadMiddleware');

const router = express.Router();

// POST /api/excel-to-pdf
router.post('/', uploadExcel.single('file'), async (req, res) => {
  const inputPath = req.file.path;
  const outputDir = '/tmp'; // Safe for Render
  const fileNameNoExt = path.parse(req.file.originalname).name;
  const outputPath = path.join(outputDir, `${fileNameNoExt}.pdf`);

  try {
    // ✅ Convert Excel → PDF using LibreOffice CLI
    await new Promise((resolve, reject) => {
      exec(
        `libreoffice --headless --convert-to pdf --outdir ${outputDir} ${inputPath}`,
        (err, stdout, stderr) => {
          if (err) return reject(`LibreOffice error: ${stderr}`);
          resolve();
        }
      );
    });

    if (!fs.existsSync(outputPath)) {
      return res.status(500).send('❌ PDF not created. Conversion failed.');
    }

    // ✅ Send final PDF
    res.download(outputPath, `${fileNameNoExt}.pdf`, (err) => {
      // Cleanup
      fs.unlinkSync(inputPath);
      fs.unlinkSync(outputPath);
      if (err) console.error('Download error:', err);
    });
  } catch (err) {
    console.error('🔴 Excel to PDF Error:', err);
    if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
    if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
    res.status(500).send('❌ Conversion failed');
  }
});

module.exports = router;
