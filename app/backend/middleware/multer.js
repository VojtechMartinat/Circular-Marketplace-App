export function single(image) {
    return undefined;
}

const multer = require('multer');
const fs = require('fs');
const path = require('path');

// Ensure the uploads directory exists
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir); // Folder where files will be stored
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname); // Unique file name
    }
});

// Initialize multer with storage configuration
const upload = multer({ storage: storage });

module.exports = upload;