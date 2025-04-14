import { GridFSBucket } from 'mongodb';
import mongoose from 'mongoose';
import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';

/**
 * GridFS is MongoDB's specification for storing and retrieving large files.
 * It divides files into chunks and stores them in two collections:
 * - fs.files: Stores file metadata
 * - fs.chunks: Stores the actual file data in chunks
 */
const bucket = new GridFSBucket(mongoose.connection.db, {
  bucketName: 'images' // Custom bucket name for our images
});

/**
 * Uploads an image to GridFS with the following steps:
 * 1. Generates a unique filename using UUID
 * 2. Processes the image (resizes if needed)
 * 3. Uploads the processed image to GridFS
 * 4. Generates and uploads a thumbnail
 * 
 * @param {Object} file - The file object from multer
 * @returns {Object} Image metadata including filenames and size
 */
export const uploadImage = async (file) => {
  try {
    // Generate a unique filename to prevent collisions
    const filename = `${uuidv4()}.${file.originalname.split('.').pop()}`;
    
    // Create a write stream to GridFS with the file's content type
    const uploadStream = bucket.openUploadStream(filename, {
      contentType: file.mimetype
    });

    // Process image with sharp:
    // - Resize to max 800x800 while maintaining aspect ratio
    // - Don't enlarge small images
    const processedImageBuffer = await sharp(file.buffer)
      .resize(800, 800, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .toBuffer();

    // Upload the processed image to GridFS
    await new Promise((resolve, reject) => {
      uploadStream.end(processedImageBuffer, (error) => {
        if (error) reject(error);
        else resolve();
      });
    });

    // Generate a thumbnail version of the image:
    // - Resize to 200x200
    // - Use cover fit to ensure the thumbnail is always filled
    const thumbnailBuffer = await sharp(file.buffer)
      .resize(200, 200, {
        fit: 'cover',
        position: 'center'
      })
      .toBuffer();

    // Upload the thumbnail to GridFS with a 'thumb_' prefix
    const thumbnailFilename = `thumb_${filename}`;
    const thumbnailUploadStream = bucket.openUploadStream(thumbnailFilename, {
      contentType: file.mimetype
    });

    await new Promise((resolve, reject) => {
      thumbnailUploadStream.end(thumbnailBuffer, (error) => {
        if (error) reject(error);
        else resolve();
      });
    });

    // Return metadata about the uploaded files
    return {
      filename,
      thumbnailFilename,
      contentType: file.mimetype,
      size: processedImageBuffer.length
    };
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

/**
 * Creates a readable stream for downloading an image from GridFS
 * @param {string} filename - The filename to retrieve
 * @returns {ReadableStream} A stream that can be piped to the response
 */
export const getImageStream = (filename) => {
  return bucket.openDownloadStreamByName(filename);
};

/**
 * Deletes both the original image and its thumbnail from GridFS
 * @param {string} filename - The filename to delete
 * @returns {boolean} True if deletion was successful
 */
export const deleteImage = async (filename) => {
  try {
    // Find both the original file and its thumbnail
    const files = await bucket.find({ 
      filename: { $in: [filename, `thumb_${filename}`] } 
    }).toArray();
    
    // Delete all found files
    await Promise.all(files.map(file => bucket.delete(file._id)));
    return true;
  } catch (error) {
    console.error('Error deleting image:', error);
    throw error;
  }
}; 