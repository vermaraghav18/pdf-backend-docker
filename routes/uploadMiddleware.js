const multer = require('multer');
const path = require('path');
const fs = require('fs');

// ➕ Ensure /uploads folder exists
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// ➕ Shared storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});

// ➕ Dynamic uploader generator
function createUploader(allowedMimeTypes) {
  return multer({
    storage,
    fileFilter: (req, file, cb) => {
      if (allowedMimeTypes.includes(file.mimetype)) cb(null, true);
      else cb(new Error(`❌ Invalid file type: ${file.mimetype}`), false);
    },
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB
  });
}

// ➕ Preconfigured uploaders by type
const uploadPDF = createUploader(['application/pdf']);
const uploadWord = createUploader([
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
]);
const uploadExcel = createUploader([
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
]);
const uploadPPT = createUploader([
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation'
]);
const uploadImage = createUploader(['image/jpeg', 'image/png', 'image/webp']);

// ➕ Export them for per-route usage
module.exports = {
  uploadPDF,
  uploadWord,
  uploadExcel,
  uploadPPT,
  uploadImage
};
