const multer = require('multer');
const path = require('path');
const os = require('os');

// ✅ Use OS-safe tmp directory for all uploads
const uploadDir = os.tmpdir();

// ✅ Shared storage config using safe tmp location
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});

// ✅ Dynamic uploader generator with MIME filter
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

// ✅ Preconfigured uploaders by file type
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

// ✅ Export all uploaders
module.exports = {
  uploadPDF,
  uploadWord,
  uploadExcel,
  uploadPPT,
  uploadImage
};
