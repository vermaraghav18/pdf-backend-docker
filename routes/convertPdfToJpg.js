const express = require('express');
const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');
const upload = require('./uploadMiddleware');
const archiver = require('archiver');

const router = express.Router();

router.post('/', upload.single('file'), async (req, res) => {
  try {
    const inputPath = req.file.path;
    const baseName = path.basename(inputPath, '.pdf');
    const outputDir = path.join(__dirname, '..', 'outputs', baseName + '-' + Date.now());

    // Create output directory
    fs.mkdirSync(outputDir, { recursive: true });

    // Convert PDF to JPG using pdf-poppler
    const convertCommand = `pdftoppm "${inputPath}" "${outputDir}/page" -jpeg`;
    exec(convertCommand, (error) => {
      if (error) {
        console.error('❌ Conversion failed:', error);
        return res.status(500).json({ error: 'Conversion failed' });
      }

      // Create ZIP
      const zipPath = `${outputDir}.zip`;
      const output = fs.createWriteStream(zipPath);
      const archive = archiver('zip');

      output.on('close', () => {
        res.download(zipPath, 'pdf-to-jpg.zip', () => {
          // Cleanup
          fs.unlinkSync(inputPath);
          fs.rmSync(outputDir, { recursive: true, force: true });
          fs.unlinkSync(zipPath);
        });
      });

      archive.on('error', (err) => {
        console.error('❌ Archiving error:', err);
        res.status(500).send('Zip creation failed.');
      });

      archive.pipe(output);
      archive.directory(outputDir, false);
      archive.finalize();
    });
  } catch (err) {
    console.error('❌ Error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
