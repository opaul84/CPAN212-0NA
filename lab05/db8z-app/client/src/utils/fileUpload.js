const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes
const ALLOWED_FILE_TYPES = {
  image: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  document: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  link: ['text/uri-list']
};

export const validateFile = (file) => {
  const errors = [];

  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    errors.push('File size exceeds 5MB limit');
  }

  // Check file type
  let isValidType = false;
  for (const [category, types] of Object.entries(ALLOWED_FILE_TYPES)) {
    if (types.includes(file.type)) {
      isValidType = true;
      break;
    }
  }

  if (!isValidType) {
    errors.push('Invalid file type');
  }

  return {
    isValid: errors.length === 0,
    errors,
    fileType: getFileCategory(file.type)
  };
};

export const getFileCategory = (mimeType) => {
  for (const [category, types] of Object.entries(ALLOWED_FILE_TYPES)) {
    if (types.includes(mimeType)) {
      return category;
    }
  }
  return null;
};

export const uploadFile = async (file) => {
  const validation = validateFile(file);
  if (!validation.isValid) {
    throw new Error(validation.errors.join(', '));
  }

  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch('http://localhost:5000/api/upload', {
      method: 'POST',
      body: formData,
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    const data = await response.json();
    return {
      type: validation.fileType,
      url: data.url,
      name: file.name,
      size: file.size,
      mimeType: file.type,
      thumbnailUrl: data.thumbnailUrl
    };
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
};

export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}; 