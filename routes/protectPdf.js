// routes/protectPdf.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const { upload } = require('./uploadMiddleware');

const router = express.Router();

router.post('/', upload.single('pdf'), async (req, res) => {
  try {
    const inputPath = req.file.path;
    const password = req.body.password || 'defaultpass';

    const outputPath = path.join('uploads', `protected-${Date.now()}.pdf`);

    // qpdf command to add password
    const cmd = `qpdf --encrypt ${password} ${password} 256 -- "${inputPath}" "${outputPath}"`;

    exec(cmd, (err) => {
      if (err) {
        console.error('🔒 Protect Error:', err);
        return res.status(500).json({ error: 'Failed to protect PDF' });
      }

      res.download(outputPath, 'protected.pdf', () => {
        fs.unlinkSync(inputPath);
        fs.unlinkSync(outputPath);
      });
    });
  } catch (err) {
    console.error('❌ Protect Route Error:', err);
    res.status(500).json({ error: 'Failed to protect PDF' });
  }
});

module.exports = router;
