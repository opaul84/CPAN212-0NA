import React, { useState } from 'react';
import { formatFileSize } from '../utils/fileUpload';

const EMOJI_LIST = ['👍', '❤️', '😂', '😮', '😢', '😡'];

const Message = ({
  message,
  currentUser,
  onReaction,
  onReply,
  onEdit,
  onDelete,
  onFlag
}) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const isOwnMessage = message.userId === currentUser?.id;

  const handleReaction = (emoji) => {
    onReaction(message._id, emoji);
    setShowEmojiPicker(false);
  };

  const renderAttachments = () => {
    return message.attachments?.map((attachment, index) => (
      <div
        key={index}
        className="mt-2 p-2 bg-gray-700 rounded-lg flex items-center space-x-3"
      >
        {attachment.type === 'image' ? (
          <a
            href={attachment.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            <img
              src={attachment.thumbnailUrl || attachment.url}
              alt={attachment.name}
              className="max-h-32 rounded-lg"
            />
          </a>
        ) : (
          <a
            href={attachment.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 text-blue-400 hover:text-blue-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
            </svg>
            <div>
              <div className="text-sm font-medium">{attachment.name}</div>
              <div className="text-xs text-gray-400">{formatFileSize(attachment.size)}</div>
            </div>
          </a>
        )}
      </div>
    ));
  };

  const renderReactions = () => {
    if (!message.reactions?.length) return null;

    return (
      <div className="flex flex-wrap gap-1 mt-2">
        {message.reactions.map((reaction, index) => (
          <button
            key={index}
            onClick={() => handleReaction(reaction.emoji)}
            className={`px-2 py-1 rounded-full text-xs flex items-center space-x-1 ${
              reaction.users.includes(currentUser?.id)
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            <span>{reaction.emoji}</span>
            <span>{reaction.users.length}</span>
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-[70%] ${isOwnMessage ? 'bg-blue-600' : 'bg-gray-700'} rounded-lg p-3`}>
        {/* Message Header */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <img
              src={message.user?.avatar || `https://ui-avatars.com/api/?name=${message.user?.name}`}
              alt={message.user?.name}
              className="w-6 h-6 rounded-full"
            />
            <span className="text-sm font-medium text-gray-300">{message.user?.name}</span>
          </div>
          <div className="text-xs text-gray-400">
            {new Date(message.createdAt).toLocaleTimeString()}
          </div>
        </div>

        {/* Message Content */}
        <div className="space-y-2">
          {message.content.text && (
            <div className="text-white whitespace-pre-wrap break-words">
              {message.content.text}
            </div>
          )}
          {renderAttachments()}
          {renderReactions()}
        </div>

        {/* Message Actions */}
        <div className="mt-2 flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
          {/* Emoji Reaction Button */}
          <div className="relative">
            <button
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="p-1 text-gray-400 hover:text-white transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-3.646 5.854a.5.5 0 00.708.708l2-2a.5.5 0 000-.708l-2-2a.5.5 0 00-.708.708L11.293 11H7.5a.5.5 0 000 1h3.793l-1.146 1.146z" clipRule="evenodd" />
              </svg>
            </button>

            {showEmojiPicker && (
              <div className="absolute bottom-full right-0 mb-2 bg-gray-800 rounded-lg shadow-lg p-2 flex space-x-1">
                {EMOJI_LIST.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => handleReaction(emoji)}
                    className="p-1 hover:bg-gray-700 rounded transition-colors"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Reply Button */}
          <button
            onClick={() => onReply(message)}
            className="p-1 text-gray-400 hover:text-white transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.707 3.293a1 1 0 010 1.414L5.414 7H11a7 7 0 017 7v2a1 1 0 11-2 0v-2a5 5 0 00-5-5H5.414l2.293 2.293a1 1 0 11-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </button>

          {/* Edit/Delete Buttons (only for own messages) */}
          {isOwnMessage && (
            <>
              <button
                onClick={() => onEdit(message)}
                className="p-1 text-gray-400 hover:text-white transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
              </button>
              <button
                onClick={() => onDelete(message._id)}
                className="p-1 text-gray-400 hover:text-red-500 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </button>
            </>
          )}

          {/* Flag Button (for other's messages) */}
          {!isOwnMessage && (
            <button
              onClick={() => onFlag(message._id)}
              className="p-1 text-gray-400 hover:text-yellow-500 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z" clipRule="evenodd" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Message; 