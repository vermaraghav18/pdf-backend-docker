const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const os = require('os');
const { exec } = require('child_process');

const router = express.Router();

// ✅ Use OS-safe temp directory for Windows/Linux/Render compatibility
const upload = multer({ dest: os.tmpdir() });

router.post('/', upload.single('file'), async (req, res) => {
  const password = req.body.password;
  const originalName = req.file.originalname;
  const ext = path.extname(originalName).toLowerCase();
  const inputPath = req.file.path;
  const outputPath = inputPath + '-protected.pdf';

  // ❌ Validation: Only PDFs
  if (ext !== '.pdf') {
    fs.unlinkSync(inputPath);
    return res.status(400).send('❌ Only PDF files are supported');
  }

  // ❌ Validation: Password must be strong enough
  if (!password || password.length < 3) {
    fs.unlinkSync(inputPath);
    return res.status(400).send('❌ Password must be at least 3 characters');
  }

  try {
    // ✅ Safely escape paths and use AES 256 encryption (recommended)
    const safeInput = JSON.stringify(inputPath);
    const safeOutput = JSON.stringify(outputPath);
    const cmd = `qpdf --encrypt "${password}" "${password}" 256 -- ${safeInput} ${safeOutput}`;

    exec(cmd, (error) => {
      if (error) {
        console.error('🔴 qpdf error:', error);
        if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
        return res.status(500).send('❌ Failed to protect PDF');
      }

      // ✅ Send back the protected file
      res.setHeader('Content-Disposition', 'attachment; filename=protected.pdf');
      res.contentType('application/pdf');
      fs.createReadStream(outputPath).pipe(res);

      // ♻️ Cleanup after a short delay
      setTimeout(() => {
        if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
        if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
      }, 5000);
    });
  } catch (err) {
    console.error('❌ Protect PDF Error:', err.message);
    if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
    res.status(500).send('❌ Internal server error');
  }
});

module.exports = router;
