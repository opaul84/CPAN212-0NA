const multer = require('multer');
const sharp = require('sharp');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs').promises;

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/files');
    },
    filename: (req, file, cb) => {
        const uniqueFilename = `${uuidv4()}${path.extname(file.originalname)}`;
        cb(null, uniqueFilename);
    }
});

// File filter to accept only image files
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed!'), false);
    }
};

// Create the multer upload instance
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

// Function to generate thumbnail
async function generateThumbnail(filePath, filename) {
    const thumbnailPath = path.join('uploads/thumbnails', filename);
    
    try {
        await sharp(filePath)
            .resize(200, 200, {
                fit: 'cover',
                position: 'center'
            })
            .toFile(thumbnailPath);
        
        return thumbnailPath;
    } catch (error) {
        console.error('Error generating thumbnail:', error);
        throw error;
    }
}

// Function to delete file and its thumbnail
async function deleteFile(filename) {
    try {
        const filePath = path.join('uploads/files', filename);
        const thumbnailPath = path.join('uploads/thumbnails', filename);
        
        await Promise.all([
            fs.unlink(filePath).catch(err => console.error('Error deleting file:', err)),
            fs.unlink(thumbnailPath).catch(err => console.error('Error deleting thumbnail:', err))
        ]);
        
        return true;
    } catch (error) {
        console.error('Error in deleteFile:', error);
        return false;
    }
}

module.exports = {
    upload,
    generateThumbnail,
    deleteFile
}; 