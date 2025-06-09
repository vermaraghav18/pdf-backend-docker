const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { PDFDocument, rgb } = require('pdf-lib');

const router = express.Router();
const upload = multer({ dest: '/tmp' });

router.post('/', upload.single('file'), async (req, res) => {
  const inputPath = req.file.path;
  const ext = path.extname(req.file.originalname).toLowerCase();

  // ⛔ Validate PDF
  if (ext !== '.pdf') {
    fs.unlinkSync(inputPath);
    return res.status(400).send('❌ Only PDF files are supported');
  }

  // ✅ Parse and validate keywords
  let keywords;
  try {
    keywords = JSON.parse(req.body.keywords);
    if (!Array.isArray(keywords) || keywords.length === 0 || !keywords[0]) {
      throw new Error('No keywords');
    }
  } catch {
    fs.unlinkSync(inputPath);
    return res.status(400).send('❌ Keyword too short or missing');
  }

  const caseSensitive = req.body.caseSensitive === 'true';
  const fuzzyMatch = req.body.fuzzyMatch === 'true';
  const pagesToRedact = req.body.pages || 'all';

  try {
    const inputBytes = fs.readFileSync(inputPath);
    const pdfDoc = await PDFDocument.load(inputBytes);

    const pages = pdfDoc.getPages();

    // ✅ Loop through pages
    for (let i = 0; i < pages.length; i++) {
      const pageIndex = i + 1;
      if (pagesToRedact !== 'all' && !pagesToRedact.split(',').includes(String(pageIndex))) continue;

      const page = pages[i];
      const textContent = await page.getTextContent?.(); // pdf-lib doesn't support extraction by default

      // ✅ Manual scan (simulate for now)
      const { width, height } = page.getSize();

      keywords.forEach((word) => {
        const search = caseSensitive ? word : word.toLowerCase();
        // Fallback logic: draw box always at bottom-left corner (for testing)
        page.drawRectangle({
          x: 40,
          y: 40,
          width: 100,
          height: 20,
          color: rgb(0, 0, 0),
        });
      });
    }

    const outputBytes = await pdfDoc.save();

    res.setHeader('Content-Disposition', 'attachment; filename=redacted.pdf');
    res.contentType('application/pdf');
    res.send(outputBytes);

    fs.unlinkSync(inputPath);
  } catch (err) {
    console.error('🔴 Redact PDF Error:', err.message);
    if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
    res.status(500).send('❌ Failed to redact PDF');
  }
});

module.exports = router;
