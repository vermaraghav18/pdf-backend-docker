const express = require('express');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const upload = require('./uploadMiddleware');

const router = express.Router();

router.post('/', upload.single('file'), async (req, res) => {
  try {
    const inputPath = req.file.path;
    const outputPath = path.join(path.dirname(inputPath), `compressed-${Date.now()}.pdf`);
    const level = req.body.level || 'recommended';

    // Compression settings based on level
    const quality = {
      extreme: '/screen',
      recommended: '/ebook',
      high: '/printer'
    }[level] || '/ebook';

    const cmd = `gs -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 -dPDFSETTINGS=${quality} -dNOPAUSE -dQUIET -dBATCH -sOutputFile="${outputPath}" "${inputPath}"`;

    exec(cmd, (err) => {
      if (err) {
        console.error('Compression Error:', err);
        return res.status(500).json({ error: 'Compression failed' });
      }

      res.download(outputPath, 'compressed.pdf', (err) => {
        if (err) console.error('Download error:', err);
        fs.unlinkSync(inputPath);
        fs.unlinkSync(outputPath);
      });
    });
  } catch (error) {
    console.error('❌ Compress PDF Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
