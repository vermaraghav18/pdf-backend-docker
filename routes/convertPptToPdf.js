const express = require('express');
const fs = require('fs');
const path = require('path');
const os = require('os');
const { exec } = require('child_process');
const { uploadPPT } = require('./uploadMiddleware');

const router = express.Router();

router.post('/', uploadPPT.single('file'), async (req, res) => {
  const inputPath = req.file.path; // <-- use path from multer's storage
  const outputDir = path.dirname(inputPath); // same folder

  const command = `soffice --headless --convert-to pdf --outdir "${outputDir}" "${inputPath}"`;

  exec(command, (err, stdout, stderr) => {
    if (err) {
      console.error('Conversion error:', err);
      return res.status(500).send('❌ Conversion failed');
    }

    const pdfFileName = req.file.filename.replace(/\.(ppt|pptx)$/i, '.pdf');
    const outputPath = path.join(outputDir, pdfFileName);

    res.download(outputPath, () => {
      fs.unlinkSync(inputPath);
      fs.unlinkSync(outputPath);
    });
  });
});

module.exports = router;
