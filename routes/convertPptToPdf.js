const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const os = require('os');
const { exec } = require('child_process');

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, os.tmpdir()),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

router.post('/', upload.single('file'), (req, res) => {
  const inputPath = path.join(os.tmpdir(), req.file.filename);
  const outputDir = os.tmpdir();

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
