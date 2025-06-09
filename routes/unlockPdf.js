const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const os = require('os');
const { exec } = require('child_process');

const router = express.Router();
const upload = multer({ dest: os.tmpdir() }); // ✅ Cross-platform safe

router.post('/', upload.single('file'), async (req, res) => {
  const password = req.body.password;
  const originalName = req.file.originalname;
  const ext = path.extname(originalName).toLowerCase();
  const inputPath = req.file.path;
  const outputPath = inputPath + '-unlocked.pdf';

  // ❌ Only allow PDFs
  if (ext !== '.pdf') {
    fs.unlinkSync(inputPath);
    return res.status(400).send('❌ Only PDF files are supported');
  }

  // ❌ Must provide the correct password
  if (!password || password.length < 1) {
    fs.unlinkSync(inputPath);
    return res.status(400).send('❌ Password is required to unlock');
  }

  try {
    // ✅ Use qpdf to remove encryption
    const safeInput = JSON.stringify(inputPath);
    const safeOutput = JSON.stringify(outputPath);
    const cmd = `qpdf --password=${password} --decrypt ${safeInput} ${safeOutput}`;

    exec(cmd, (error) => {
      if (error) {
        console.error('🔴 qpdf unlock error:', error);
        if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
        return res.status(500).send('❌ Failed to unlock PDF (incorrect password?)');
      }

      // ✅ Stream unlocked PDF
      res.setHeader('Content-Disposition', 'attachment; filename=unlocked.pdf');
      res.contentType('application/pdf');
      fs.createReadStream(outputPath).pipe(res);

      // ♻️ Cleanup
      setTimeout(() => {
        if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
        if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
      }, 5000);
    });
  } catch (err) {
    console.error('❌ Unlock PDF Error:', err.message);
    if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
    res.status(500).send('❌ Internal server error');
  }
});

module.exports = router;
