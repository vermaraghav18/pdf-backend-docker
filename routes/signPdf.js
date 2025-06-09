const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const os = require('os');
const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');

const router = express.Router();
const upload = multer({ dest: os.tmpdir() });

router.post('/', upload.single('file'), async (req, res) => {
  const signature = req.body.signatureText;
  const position = req.body.position || 'bottom-right';
  const originalName = req.file.originalname;
  const ext = path.extname(originalName).toLowerCase();
  const inputPath = req.file.path;
  const outputPath = inputPath + '-signed.pdf';

  if (ext !== '.pdf') {
    fs.unlinkSync(inputPath);
    return res.status(400).send('❌ Only PDF files are supported');
  }

  if (!signature || signature.length < 2) {
    fs.unlinkSync(inputPath);
    return res.status(400).send('❌ Signature text is too short');
  }

  try {
    const existingPdfBytes = fs.readFileSync(inputPath);
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const pages = pdfDoc.getPages();
    const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    // Default color and size
    const fontSize = 18;
    const textWidth = font.widthOfTextAtSize(signature, fontSize);

    pages.forEach((page) => {
      const { width, height } = page.getSize();

      // Default position
      let x = width - textWidth - 50;
      let y = 50;

      if (position === 'top-left')     { x = 50; y = height - 50; }
      else if (position === 'top-right')  { x = width - textWidth - 50; y = height - 50; }
      else if (position === 'bottom-left'){ x = 50; y = 50; }
      else if (position === 'center')     { x = (width - textWidth) / 2; y = height / 2; }

      page.drawText(signature, {
        x,
        y,
        size: fontSize,
        font,
        color: rgb(0.2, 0.2, 0.2)
      });
    });

    const pdfBytes = await pdfDoc.save();
    fs.writeFileSync(outputPath, pdfBytes);

    res.setHeader('Content-Disposition', 'attachment; filename=signed.pdf');
    res.contentType('application/pdf');
    fs.createReadStream(outputPath).pipe(res);

    // Cleanup
    setTimeout(() => {
      if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
      if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
    }, 5000);
  } catch (err) {
    console.error('❌ Sign PDF Error:', err.message);
    if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
    res.status(500).send('❌ Failed to sign PDF');
  }
});

module.exports = router;
