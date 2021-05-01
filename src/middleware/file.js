const multer = require('multer');

const uploadImage = multer({ 
  limits: {
    // 1MB
    fileSize: 1000000
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(png|jpg|jpeg)$/)) {
      return cb(new Error('Please upload an image'));
    }

    cb(undefined, true);
  }
});

module.exports = {
  uploadImage
};
