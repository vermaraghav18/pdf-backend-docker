const express = require('express');
const fs = require('fs');
const path = require('path');
const upload = require('./uploadMiddleware');
const pdfParse = require('pdf-parse');
const stringSimilarity = require('string-similarity');

const router = express.Router();

// 👇 Multer middleware for two files
const compareUpload = upload.fields([
  { name: 'pdf1', maxCount: 1 },
  { name: 'pdf2', maxCount: 1 }
]);

router.post('/', compareUpload, async (req, res) => {
  try {
    const file1 = req.files['pdf1'][0];
    const file2 = req.files['pdf2'][0];

    const data1 = await pdfParse(fs.readFileSync(file1.path));
    const data2 = await pdfParse(fs.readFileSync(file2.path));

    const lines1 = data1.text.split('\n').map(line => line.trim()).filter(Boolean);
    const lines2 = data2.text.split('\n').map(line => line.trim()).filter(Boolean);

    const differences = [];
    const allLines = Math.max(lines1.length, lines2.length);
    let matches = 0;

    for (let i = 0; i < allLines; i++) {
      const line1 = lines1[i] || '';
      const line2 = lines2[i] || '';
      if (line1 === line2) {
        matches++;
      } else {
        differences.push({ line: i + 1, pdf1: line1, pdf2: line2 });
      }
    }

    const similarityScore = stringSimilarity.compareTwoStrings(data1.text, data2.text) * 100;

    // Clean up
    fs.unlinkSync(file1.path);
    fs.unlinkSync(file2.path);

    res.json({
      similarity: similarityScore.toFixed(2) + '%',
      differences
    });
  } catch (err) {
    console.error('❌ Compare PDF Error:', err);
    res.status(500).json({ error: 'Failed to compare PDF files.' });
  }
});

module.exports = router;
