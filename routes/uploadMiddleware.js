  const multer = require('multer');
  const path = require('path');
  const fs = require('fs');

  // Make sure uploads folder exists
  const uploadDir = path.join(__dirname, '..', 'uploads');
  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

  const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
  });


  const pdfFileFilter = (req, file, cb) => {
    if (file.mimetype === 'application/pdf') cb(null, true);
    else cb(new Error('Only PDF files are allowed'), false);
  };

  const upload = multer({ storage , fileFilter: pdfFileFilter });


  module.exports = { upload };
