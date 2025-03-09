const multer = require('multer');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Ensure the uploads directory exists
const uploadDir = path.join('/tmp', 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir); // Folder where files will be stored
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + crypto.randomBytes(6).toString('hex');
        cb(null, uniqueSuffix + '-' + file.originalname); // Unique file name
    }
});

// Initialize multer with storage configuration
const upload = multer({ storage: storage });

module.exports = upload;