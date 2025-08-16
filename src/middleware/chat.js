const multer = require('multer');
const { Upload } = require('@aws-sdk/lib-storage');
const s3Client = require('../config/cloudinary')

const storage = multer.memoryStorage();

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        console.log('File received:', file);
        const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp','audio/mp3'];
        if (allowedMimeTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Only JPEG, PNG, GIF, and WebP image files are allowed'), false);
        }
    },
});

const uploadToS3 = async (files) => {
    try {
        const uploadPromises = files.map((file) => {
            const uploadParams = {
                Bucket: process.env.AWS_S3_BUCKET_NAME,
                Key: `uploads/${Date.now()}-${file.originalname}`, 
                Body: file.buffer,
                 
                ContentType: file.mimetype, 
            };


            const parallelUpload = new Upload({
                client: s3Client,
                params: uploadParams,
            });

            return parallelUpload.done();
        });

        const uploadResults = await Promise.all(uploadPromises);
        const fileUrls = uploadResults.map(result => {
            if (result && result.Location) {
                return result.Location; 
            }
            throw new Error('S3 upload failed, no location found');
        });

        return fileUrls;
    } catch (error) {
        console.error('Error uploading files to S3:', error);
        throw error; 
    }
};

module.exports = { upload, uploadToS3 };
