import express from 'express';
import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import sharp from 'sharp';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = {
    'image/jpeg': true,
    'image/png': true,
    'image/gif': true,
    'image/webp': true,
    'application/pdf': true,
    'application/msword': true,
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': true
  };

  if (allowedTypes[file.mimetype]) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
});

// Handle file upload
router.post('/', auth, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const file = req.file;
    const isImage = file.mimetype.startsWith('image/');
    let thumbnailUrl = null;

    // Generate thumbnail for images
    if (isImage) {
      const thumbnailPath = `uploads/thumbnails/${path.basename(file.filename)}`;
      await sharp(file.path)
        .resize(200, 200, {
          fit: 'inside',
          withoutEnlargement: true
        })
        .toFile(thumbnailPath);
      thumbnailUrl = `/uploads/thumbnails/${file.filename}`;
    }

    res.json({
      url: `/uploads/${file.filename}`,
      thumbnailUrl,
      name: file.originalname,
      size: file.size,
      mimeType: file.mimetype
    });
  } catch (error) {
    console.error('File upload error:', error);
    res.status(500).json({ message: 'File upload failed' });
  }
});

// Serve uploaded files
router.get('/:filename', (req, res) => {
  const { filename } = req.params;
  res.sendFile(path.join(process.cwd(), 'uploads', filename));
});

// Serve thumbnails
router.get('/thumbnails/:filename', (req, res) => {
  const { filename } = req.params;
  res.sendFile(path.join(process.cwd(), 'uploads/thumbnails', filename));
});

export default router; 