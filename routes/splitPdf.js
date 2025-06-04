// routes/splitPdf.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const { PDFDocument } = require('pdf-lib');
const archiver = require('archiver');

const router = express.Router();

// 📁 Save in uploads/ (safe across Windows + Render)
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, '/tmp'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

router.post('/', upload.single('pdf'), async (req, res) => {
  try {
    const pageNumber = parseInt(req.body.splitAfter, 10);
    if (!pageNumber || pageNumber < 1) {
      return res.status(400).send('❌ Invalid splitAfter value');
    }

    const inputPath = req.file.path;
    const existingPdfBytes = fs.readFileSync(inputPath);
    const inputPdf = await PDFDocument.load(existingPdfBytes);

    const totalPages = inputPdf.getPageCount();
    if (pageNumber >= totalPages) {
      return res.status(400).send('❌ splitAfter must be less than total pages');
    }

    const firstPdf = await PDFDocument.create();
    const secondPdf = await PDFDocument.create();

    const copied1 = await firstPdf.copyPages(inputPdf, [...Array(pageNumber).keys()]);
    copied1.forEach((page) => firstPdf.addPage(page));

    const copied2 = await secondPdf.copyPages(inputPdf, Array.from({ length: totalPages - pageNumber }, (_, i) => i + pageNumber));
    copied2.forEach((page) => secondPdf.addPage(page));

    const timestamp = Date.now();
    const outDir = '/tmp';
    const out1Path = path.join(outDir, `part1-${timestamp}.pdf`);
    const out2Path = path.join(outDir, `part2-${timestamp}.pdf`);
    fs.writeFileSync(out1Path, await firstPdf.save());
    fs.writeFileSync(out2Path, await secondPdf.save());

    const zipPath = path.join(outDir, `split-${timestamp}.zip`);
    const output = fs.createWriteStream(zipPath);
    const archive = archiver('zip', { zlib: { level: 9 } });

    archive.pipe(output);
    archive.file(out1Path, { name: 'part1.pdf' });
    archive.file(out2Path, { name: 'part2.pdf' });
    await archive.finalize();

    output.on('close', () => {
      res.download(zipPath, () => {
        fs.unlinkSync(inputPath);
        fs.unlinkSync(out1Path);
        fs.unlinkSync(out2Path);
        fs.unlinkSync(zipPath);
      });
    });

  } catch (err) {
    console.error('Split error:', err);
    res.status(500).send('❌ Failed to split PDF');
  }
});

module.exports = router;
