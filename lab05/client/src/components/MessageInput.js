import React, { useState, useRef } from 'react';
import axios from 'axios';

/**
 * MessageInput Component
 * Handles message composition and image uploads in the chat
 * Features:
 * - Text input for message content
 * - Image upload button
 * - Loading state during upload
 * - Form validation
 * 
 * @param {Function} onSendMessage - Callback function when a message is sent
 * @param {string} debateId - The ID of the current debate
 */
const MessageInput = ({ onSendMessage, debateId }) => {
  // State for message text and upload status
  const [message, setMessage] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  // Ref for the hidden file input
  const fileInputRef = useRef(null);

  /**
   * Handles the image upload process:
   * 1. Creates a FormData object with the image
   * 2. Sends it to the server
   * 3. Returns the image metadata for the message
   * 
   * @param {File} file - The image file to upload
   * @returns {Object} Image metadata including filenames and size
   */
  const handleImageUpload = async (file) => {
    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('image', file);

      // Send the image to the server
      const response = await axios.post('/api/images/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      // Return the image metadata
      return {
        type: 'image',
        filename: response.data.filename,
        thumbnailFilename: response.data.thumbnailFilename,
        name: file.name,
        size: response.data.size,
        mimeType: response.data.contentType
      };
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  /**
   * Handles form submission:
   * 1. Validates input
   * 2. Uploads image if present
   * 3. Creates message data
   * 4. Calls onSendMessage callback
   * 5. Resets form state
   * 
   * @param {Event} e - The form submission event
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim() && !fileInputRef.current?.files?.length) return;

    try {
      // Handle image upload if a file is selected
      const attachments = [];
      if (fileInputRef.current?.files?.length) {
        const file = fileInputRef.current.files[0];
        if (file.type.startsWith('image/')) {
          const imageData = await handleImageUpload(file);
          attachments.push(imageData);
        }
      }

      // Create the message data
      const messageData = {
        debateId,
        content: {
          text: message.trim(),
          format: 'plain'
        },
        attachments
      };

      // Send the message
      onSendMessage(messageData);
      
      // Reset form state
      setMessage('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border-t border-gray-700">
      <div className="flex items-center space-x-2">
        {/* Text input for message content */}
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        
        {/* Hidden file input for image upload */}
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          className="hidden"
          onChange={handleSubmit}
        />
        
        {/* Image upload button */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="p-2 text-gray-400 hover:text-white transition-colors"
          title="Attach image"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </button>
        
        {/* Send button with loading state */}
        <button
          type="submit"
          disabled={isUploading || (!message.trim() && !fileInputRef.current?.files?.length)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isUploading ? (
            // Loading spinner
            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            'Send'
          )}
        </button>
      </div>
    </form>
  );
};

export default MessageInput; 