import React from 'react';
import { formatDistanceToNow } from 'date-fns';

/**
 * Message Component
 * Displays a single message in the chat, including:
 * - User information (avatar, name)
 * - Message content (text and attachments)
 * - Timestamp
 * - Reactions
 * 
 * @param {Object} message - The message object containing content, attachments, etc.
 * @param {Object} currentUser - The currently logged-in user
 */
const Message = ({ message, currentUser }) => {
  // Determine if the message is from the current user
  const isOwnMessage = message.userId === currentUser?.id;

  /**
   * Renders message attachments (currently only images)
   * Each attachment is displayed with:
   * - The image itself
   * - A hover overlay showing the filename
   * - Click handler to open full-size image
   */
  const renderAttachments = () => {
    if (!message.attachments?.length) return null;

    return (
      <div className="space-y-2">
        {message.attachments.map((attachment, index) => {
          if (attachment.type === 'image') {
            return (
              <div key={index} className="relative group">
                <img
                  src={`/api/images/${attachment.filename}`}
                  alt={attachment.name || 'Image attachment'}
                  className="max-w-full rounded-lg cursor-pointer"
                  onClick={() => window.open(`/api/images/${attachment.filename}`, '_blank')}
                />
                <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                  {attachment.name || 'Image'}
                </div>
              </div>
            );
          }
          return null;
        })}
      </div>
    );
  };

  /**
   * Renders message reactions (emojis)
   * Each reaction shows:
   * - The emoji
   * - The count of users who reacted
   * - Different styling for user's own reactions
   */
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
        {/* Message Header: User info and timestamp */}
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
            {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
          </div>
        </div>

        {/* Message Content: Text, attachments, and reactions */}
        <div className="space-y-2">
          {message.content.text && (
            <div className="text-white whitespace-pre-wrap break-words">
              {message.content.text}
            </div>
          )}
          {renderAttachments()}
          {renderReactions()}
        </div>
      </div>
    </div>
  );
};

export default Message; 