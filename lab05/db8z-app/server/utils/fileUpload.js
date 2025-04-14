const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/files');
  },
  filename: (req, file, cb) => {
    const uniqueFilename = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueFilename);
  }
});

// File filter to accept only images
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Not an image! Please upload only images.'), false);
  }
};

// Initialize multer upload
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Function to create thumbnail
const createThumbnail = async (file) => {
  const thumbnailPath = path.join('uploads/thumbnails', file.filename);
  
  await sharp(file.path)
    .resize(200, 200, {
      fit: 'cover',
      position: 'center'
    })
    .toFile(thumbnailPath);

  return thumbnailPath;
};

// Function to delete file and its thumbnail
const deleteFile = async (filename) => {
  const filePath = path.join('uploads/files', filename);
  const thumbnailPath = path.join('uploads/thumbnails', filename);

  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    if (fs.existsSync(thumbnailPath)) {
      fs.unlinkSync(thumbnailPath);
    }
  } catch (error) {
    console.error('Error deleting files:', error);
    throw error;
  }
};

module.exports = {
  upload,
  createThumbnail,
  deleteFile
}; 