const express = require('express');
const path = require('path');
const fs = require('fs');
const { fromPath } = require('pdf2pic');
const upload = require('./uploadMiddleware');
const archiver = require('archiver');
const { PDFDocument } = require('pdf-lib');

const router = express.Router();

router.post('/', upload.single('file'), async (req, res) => {
  try {
    const inputPath = req.file.path;
    const baseName = path.basename(inputPath, '.pdf');
    const outputDir = path.join(__dirname, '..', 'outputs', baseName + '-' + Date.now());
    fs.mkdirSync(outputDir, { recursive: true });

    // 🧠 Get total pages using pdf-lib
    const pdfBuffer = fs.readFileSync(inputPath);
    const pdfDoc = await PDFDocument.load(pdfBuffer);
    const totalPages = pdfDoc.getPageCount();

    // Convert with pdf2pic
    const converter = fromPath(inputPath, {
      density: 100,
      saveFilename: 'page',
      savePath: outputDir,
      format: 'jpg',
      width: 800,
      height: 1000
    });

    const conversionPromises = [];
    for (let i = 1; i <= totalPages; i++) {
      conversionPromises.push(converter(i));
    }

    await Promise.all(conversionPromises);

    // Create ZIP
    const zipPath = `${outputDir}.zip`;
    const output = fs.createWriteStream(zipPath);
    const archive = archiver('zip');

    output.on('close', () => {
      res.download(zipPath, 'pdf-to-jpg.zip', () => {
        fs.unlinkSync(inputPath);
        fs.rmSync(outputDir, { recursive: true, force: true });
        fs.unlinkSync(zipPath);
      });
    });

    archive.on('error', (err) => {
      console.error('❌ Archive error:', err);
      res.status(500).send('Zip creation failed.');
    });

    archive.pipe(output);
    archive.directory(outputDir, false);
    archive.finalize();
  } catch (err) {
    console.error('❌ PDF to JPG error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
