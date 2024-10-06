const multer = require('multer');
const {GridFsStorage} = require('multer-gridfs-storage');
require('dotenv').config();

// Set up multer-gridfs-storage
const storage = new GridFsStorage({
    url: process.env.MONGO_URI, // Use MONGO_URI from .env file
    options: { useNewUrlParser: true, useUnifiedTopology: true },
    file: (req, file) => {
        const match = ['image/png', 'image/jpeg'];

        if (match.indexOf(file.mimetype) === -1) {
            return `${Date.now()}-cake-${file.originalname}`;
        }

        return {
            bucketName: 'photos',  // Name of the bucket in MongoDB
            filename: `${Date.now()}-cake-${file.originalname}`
        };
    }
});

module.exports = multer({ storage });
