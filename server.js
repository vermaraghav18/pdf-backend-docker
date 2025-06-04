// server.js
const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors());

const mergePdfRoute = require('./routes/mergePdf');
const splitPdfRoute = require('./routes/splitPdf');
const compressPdfRoute = require('./routes/compressPdf');
const comparePdfRoute = require('./routes/comparePdf');

app.use('/api/compare', comparePdfRoute);
app.use('/api/compress', compressPdfRoute);
app.use('/api/merge', mergePdfRoute);
app.use('/api/split', splitPdfRoute);


const PORT = process.env.PORT || 10000;

app.get('/', (req, res) => {
  res.send('✅ Simple backend is running!');
});

// routes/mergePdf.js
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const { PDFDocument } = require('pdf-lib');

const router = express.Router();

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

router.post('/', upload.array('pdfs', 2), async (req, res) => {
  try {
    const [file1, file2] = req.files;

    const pdfDoc = await PDFDocument.create();

    for (let file of [file1, file2]) {
      const existingPdfBytes = fs.readFileSync(file.path);
      const donorPdfDoc = await PDFDocument.load(existingPdfBytes);
      const copiedPages = await pdfDoc.copyPages(donorPdfDoc, donorPdfDoc.getPageIndices());
      copiedPages.forEach((page) => pdfDoc.addPage(page));
    }

    const mergedPdfBytes = await pdfDoc.save();

    const outputPath = path.join('uploads', `merged-${Date.now()}.pdf`);
    fs.writeFileSync(outputPath, mergedPdfBytes);

    res.download(outputPath, () => {
      fs.unlinkSync(file1.path);
      fs.unlinkSync(file2.path);
      fs.unlinkSync(outputPath);
    });
  } catch (err) {
    console.error('Merge error:', err);
    res.status(500).send('❌ Failed to merge PDFs');
  }
});

module.exports = router;



app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
