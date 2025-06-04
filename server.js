// server.js
const express = require('express');
const app = express();
const cors = require('cors');

// ✅ CORS Fix
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  methods: ['GET', 'POST'],
  credentials: true
}));

// ✅ Import Routes
const mergePdfRoute = require('./routes/mergePdf');
const splitPdfRoute = require('./routes/splitPdf');
const compressPdfRoute = require('./routes/compressPdf');
const comparePdfRoute = require('./routes/comparePdf');
const convertPdfToJpgRoute = require('./routes/convertPdfToJpg');
const convertPdfToWordRoute = require('./routes/convertPdfToWord');
const convertWordToPdfRoute = require('./routes/convertWordToPdf');
const convertPdfToExcelRouter = require('./routes/convertPdfToExcel');
const convertExcelToPdfRouter = require('./routes/convertExcelToPdf');

// ✅ Mount Routes
app.use('/api/pdf-to-excel', convertPdfToExcelRouter);
app.use('/api/excel-to-pdf', convertExcelToPdfRouter);
app.use('/api/word-to-pdf', convertWordToPdfRoute);
app.use('/api/pdf-to-word', convertPdfToWordRoute);
app.use('/api/pdf-to-jpg', convertPdfToJpgRoute);
app.use('/api/compare', comparePdfRoute);
app.use('/api/compress', compressPdfRoute);
app.use('/api/merge', mergePdfRoute);
app.use('/api/split', splitPdfRoute);

// ✅ Test Route
app.get('/', (req, res) => {
  res.send('✅ Simple backend is running!');
});

// ✅ Start Server
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
