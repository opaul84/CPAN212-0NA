import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  debateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Debate",
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  content: {
    text: {
      type: String,
      required: true,
      trim: true
    },
    richText: {
      type: Object, // Stores the rich text format data
      default: null
    },
    format: {
      type: String,
      enum: ['plain', 'markdown', 'rich'],
      default: 'plain'
    }
  },
  attachments: [{
    type: {
      type: String,
      enum: ['image', 'document', 'link'],
      required: true
    },
    url: {
      type: String,
      required: true
    },
    name: String,
    size: Number,
    mimeType: String,
    thumbnailUrl: String
  }],
  metadata: {
    isModeratorMessage: {
      type: Boolean,
      default: false
    },
    isSystemMessage: {
      type: Boolean,
      default: false
    },
    team: {
      type: String,
      enum: ['for', 'against', 'none'],
      default: 'none'
    },
    replyTo: {
      messageId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message'
      },
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      preview: String
    }
  },
  reactions: [{
    emoji: String,
    users: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }]
  }],
  status: {
    type: String,
    enum: ['active', 'edited', 'deleted', 'flagged', 'hidden'],
    default: 'active'
  },
  editHistory: [{
    content: {
      text: String,
      richText: Object
    },
    editedAt: {
      type: Date,
      default: Date.now
    },
    editedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],
  flags: [{
    reason: {
      type: String,
      required: true
    },
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Indexes for efficient querying
messageSchema.index({ debateId: 1, createdAt: 1 });
messageSchema.index({ userId: 1, createdAt: -1 });
messageSchema.index({ status: 1 });

// Virtual for reaction counts
messageSchema.virtual('reactionCounts').get(function() {
  const counts = {};
  this.reactions.forEach(reaction => {
    counts[reaction.emoji] = reaction.users.length;
  });
  return counts;
});

// Method to add a reaction
messageSchema.methods.addReaction = async function(userId, emoji) {
  let reaction = this.reactions.find(r => r.emoji === emoji);
  if (!reaction) {
    this.reactions.push({ emoji, users: [userId] });
  } else if (!reaction.users.includes(userId)) {
    reaction.users.push(userId);
  }
  return this.save();
};

// Method to remove a reaction
messageSchema.methods.removeReaction = async function(userId, emoji) {
  const reaction = this.reactions.find(r => r.emoji === emoji);
  if (reaction) {
    reaction.users = reaction.users.filter(uid => !uid.equals(userId));
    if (reaction.users.length === 0) {
      this.reactions = this.reactions.filter(r => r.emoji !== emoji);
    }
  }
  return this.save();
};

const Message = mongoose.model("Message", messageSchema);
export default Message;
