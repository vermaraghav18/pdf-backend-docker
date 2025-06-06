const express = require('express');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const { upload } = require('./uploadMiddleware');

const router = express.Router();

router.post('/', upload.single('file'), async (req, res) => {
  const inputPath = req.file.path;
  const outputDir = path.dirname(inputPath);

  try {
    // LibreOffice CLI conversion (headless)
    const cmd = `soffice --headless --convert-to pdf "${inputPath}" --outdir "${outputDir}"`;

    exec(cmd, (err, stdout, stderr) => {
      if (err) {
        console.error('LibreOffice error:', stderr);
        return res.status(500).json({ error: 'Conversion failed' });
      }

      const outputPath = inputPath.replace(/\.(doc|docx)$/i, '.pdf');

      res.download(outputPath, 'converted.pdf', () => {
        fs.unlinkSync(inputPath);
        fs.unlinkSync(outputPath);
      });
    });
  } catch (err) {
    console.error('❌ Word to PDF error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
