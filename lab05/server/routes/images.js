import express from 'express';
import multer from 'multer';
import { uploadImage, getImageStream, deleteImage } from '../utils/imageUpload.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

/**
 * Configure multer for handling file uploads:
 * - Uses memory storage (files are stored in memory as Buffer)
 * - Limits file size to 5MB
 * - Only allows image files
 */
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

/**
 * POST /api/images/upload
 * Uploads an image file to GridFS
 * Requires authentication
 * Expects multipart form data with 'image' field
 */
router.post('/upload', auth, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Upload the image to GridFS and get metadata
    const imageData = await uploadImage(req.file);
    res.json({
      filename: imageData.filename,
      thumbnailFilename: imageData.thumbnailFilename,
      contentType: imageData.contentType,
      size: imageData.size
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ error: 'Failed to upload image' });
  }
});

/**
 * GET /api/images/:filename
 * Serves an image from GridFS
 * No authentication required (public access)
 * Streams the image directly to the response
 */
router.get('/:filename', (req, res) => {
  try {
    const downloadStream = getImageStream(req.params.filename);
    downloadStream.pipe(res);
  } catch (error) {
    console.error('Error serving image:', error);
    res.status(500).json({ error: 'Failed to serve image' });
  }
});

/**
 * DELETE /api/images/:filename
 * Deletes an image and its thumbnail from GridFS
 * Requires authentication
 * Deletes both the original image and its thumbnail
 */
router.delete('/:filename', auth, async (req, res) => {
  try {
    await deleteImage(req.params.filename);
    res.json({ message: 'Image deleted successfully' });
  } catch (error) {
    console.error('Error deleting image:', error);
    res.status(500).json({ error: 'Failed to delete image' });
  }
});

export default router; 