const express = require('express');
const router = express.Router();
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../../config/cloudinary');

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'profilePic',
    allowed_formats: ['jpg', 'jpeg', 'png'], 
    transformation: [{ width: 500, height: 500, crop: 'limit' }] 
  },
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Create middleware function
const handleUpload = (req, res, next) => {
  upload.single('profilePic')(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ 
        message: 'File upload error', 
        error: err.message 
      });
    } else if (err) {
      return res.status(500).json({ 
        message: 'Server error', 
        error: err.message 
      });
    }

    
    if (req.file) {
      req.body.profilePic = req.file.path;
    }

    next();
  });
};

router.use('/', handleUpload);

module.exports = router;