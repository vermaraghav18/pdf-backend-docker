// server.js
const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();

// ✅ CORS Fix
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
}));


// ✅ Import Routes
const mergePdfRoute = require('./routes/mergePdf');
const splitPdfRoute = require('./routes/splitPdf');
const compressPdfRoute = require('./routes/compressPdf');
const comparePdfRoute = require('./routes/comparePdf');
const convertPdfToWordRoute = require('./routes/convertPdfToWord');
const convertWordToPdfRoute = require('./routes/convertWordToPdf');
const convertPdfToExcelRouter = require('./routes/convertPdfToExcel');
const convertExcelToPdfRouter = require('./routes/convertExcelToPdf');
const convertPdfToPptRoute = require('./routes/convertPdfToPpt');
const rotatePdfRoute = require('./routes/rotatePdf');
const organizePdfRoute = require('./routes/organizePdf');
const repairPdfRoute = require('./routes/repairPdf');
const addPageNumbersRoute = require('./routes/addPageNumbers');
const redactPdfRoute = require('./routes/redactPdf');
const unlockPdfRoute = require('./routes/unlockPdf');
const cropPdfRoute = require('./routes/cropPdf');
const signPdfRoute = require('./routes/signPdf');
const watermarkPdfRoute = require('./routes/watermarkPdf');
const jpgToPdfRoute = require('./routes/jpgToPdf');
const protectPdfRoute = require('./routes/protectPdf');
const convertPdfToJpgRoute = require('./routes/convertPdfToJpg');




// ✅ Mount Routes
app.use('/api/pdf-to-excel', convertPdfToExcelRouter);
console.log('✅ /api/pdf-to-excel mounted');
app.use('/api/excel-to-pdf', convertExcelToPdfRouter);
console.log('✅ /api/excel-to-pdf mounted');

app.use('/api/pdf-to-word', convertPdfToWordRoute);
console.log('✅ /api/pdf-to-word mounted');
app.use('/api/compare', comparePdfRoute);
console.log('✅ /api/compare mounted');
app.use('/api/compress', compressPdfRoute);
console.log('✅ /api/compress mounted');
app.use('/api/merge', mergePdfRoute);
console.log('✅ /api/merge mounted');
app.use('/api/split', splitPdfRoute);
console.log('✅ /api/split mounted');
app.use('/api/pdf-to-ppt', convertPdfToPptRoute);
console.log('✅ /api/pdf-to-ppt mounted');
app.use('/api/rotate', rotatePdfRoute);
console.log('✅ /api/rotate mounted');
app.use('/api/organize', organizePdfRoute);
console.log('✅ /api/organize mounted');
app.use('/api/repair', repairPdfRoute);
console.log('✅ /api/repair mounted');
app.use('/api/add-page-numbers', addPageNumbersRoute);
console.log('✅ /api/add-page-numbers mounted');
app.use('/api/redact', redactPdfRoute);
console.log('✅ /api/redact mounted');
app.use('/api/protect', protectPdfRoute);
console.log('✅ /api/protect mounted');
app.use('/api/unlock', unlockPdfRoute);
console.log('✅ /api/unlock mounted');
app.use('/api/crop', cropPdfRoute);
console.log('✅ /api/crop mounted');
app.use('/api/sign', signPdfRoute);
console.log('✅ /api/sign mounted');
app.use('/api/watermark', watermarkPdfRoute);
console.log('✅ /api/watermark mounted');
app.use('/api/pdf-to-jpg', convertPdfToJpgRoute);
console.log('✅ /api/pdf-to-jpg mounted');
app.use('/api/jpg-to-pdf', jpgToPdfRoute);
console.log('✅ /api/jpg-to-pdf mounted');
app.use('/api/word-to-pdf', convertWordToPdfRoute);
console.log('✅ /api/word-to-pdf mounted');
app.use('/api/protect', protectPdfRoute);
console.log('✅ /api/ppt-to-pdf mounted');


// ✅ Test Route
app.get('/', (req, res) => {
  res.send('✅ Simple backend is running!');
});

// ✅ Start Server
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on PORT ${PORT}`);
});
// dummy comment
