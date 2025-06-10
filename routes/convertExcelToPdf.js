// routes/convertExcelToPdf.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const { uploadExcel } = require('./uploadMiddleware'); // ✅ Use Excel-specific uploader

const router = express.Router();

router.post('/', uploadExcel.single('file'), (req, res) => {
  if (!req.file) return res.status(400).send('❌ No file uploaded.');

  const inputPath = req.file.path;
  const outputDir = path.dirname(inputPath); // safe temp dir like /tmp
  const baseFilename = path.basename(req.file.originalname, path.extname(req.file.originalname));
  const outputPath = path.join(outputDir, `${baseFilename}.pdf`);

  const command = `libreoffice --headless --convert-to pdf --outdir ${outputDir} ${inputPath}`;

  exec(command, (err, stdout, stderr) => {
    if (err) {
      console.error('❌ LibreOffice error:', stderr || err.message);
      return res.status(500).send('❌ Conversion failed.');
    }

    if (!fs.existsSync(outputPath)) {
      console.error('❌ Converted file not found:', outputPath);
      return res.status(500).send('❌ Converted file not found.');
    }

    res.download(outputPath, `${baseFilename}.pdf`, (err) => {
      // Clean temp files regardless of download result
      try {
        fs.unlinkSync(inputPath);
        fs.unlinkSync(outputPath);
      } catch (cleanupErr) {
        console.warn('⚠️ Cleanup warning:', cleanupErr.message);
      }

      if (err) console.error('❌ Download error:', err.message);
    });
  });
});

module.exports = router;
