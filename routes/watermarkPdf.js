const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const os = require('os');
const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');

const router = express.Router();

// Use OS temp directory for uploads (cross-platform safe)
const upload = multer({ dest: os.tmpdir() });

router.post('/', upload.single('file'), async (req, res) => {
  const watermark = req.body.watermarkText;
  const position = req.body.position || 'center';
  const opacity = parseFloat(req.body.opacity) || 0.3;

  const originalName = req.file.originalname;
  const ext = path.extname(originalName).toLowerCase();
  const inputPath = req.file.path;
  const outputPath = inputPath + '-watermarked.pdf';

  // 🔒 Only accept PDFs
  if (ext !== '.pdf') {
    fs.unlinkSync(inputPath);
    return res.status(400).send('❌ Only PDF files are supported');
  }

  // ✅ Validate watermark
  if (!watermark || watermark.length < 2) {
    fs.unlinkSync(inputPath);
    return res.status(400).send('❌ Watermark text must be at least 2 characters');
  }

  try {
    // 🧾 Load the original PDF
    const existingPdfBytes = fs.readFileSync(inputPath);
    const pdfDoc = await PDFDocument.load(existingPdfBytes);

    // 🖊️ Load a font and all pages
    const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const pages = pdfDoc.getPages();

    // 🔁 Apply watermark to all pages
    pages.forEach((page) => {
      const { width, height } = page.getSize();
      const fontSize = 30;
      const textWidth = font.widthOfTextAtSize(watermark, fontSize);

      // 🧭 Calculate X/Y position
      let x = (width - textWidth) / 2;
      let y = height / 2;

      if (position === 'top-left')       { x = 50; y = height - 50; }
      else if (position === 'top-right') { x = width - textWidth - 50; y = height - 50; }
      else if (position === 'bottom-left') { x = 50; y = 50; }
      else if (position === 'bottom-right') { x = width - textWidth - 50; y = 50; }

      // 🖨️ Draw the watermark text
      page.drawText(watermark, {
        x,
        y,
        size: fontSize,
        font,
        color: rgb(0.6, 0.6, 0.6),
        opacity: Math.min(Math.max(opacity, 0.1), 1.0), // clamp between 0.1–1.0
        rotate: { type: 'degrees', angle: -45 }
      });
    });

    // 📤 Save to buffer and write to file
    const pdfBytes = await pdfDoc.save();
    fs.writeFileSync(outputPath, pdfBytes);

    // 📎 Send result to user
    res.setHeader('Content-Disposition', 'attachment; filename=watermarked.pdf');
    res.contentType('application/pdf');
    fs.createReadStream(outputPath).pipe(res);

    // 🧹 Clean up files
    setTimeout(() => {
      if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
      if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
    }, 5000);
  } catch (err) {
    console.error('❌ Watermark PDF Error:', err.message);
    if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
    res.status(500).send('❌ Failed to watermark PDF');
  }
});

module.exports = router;
