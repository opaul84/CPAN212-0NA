import mongoose from 'mongoose';

const debateSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['general', 'politics', 'technology', 'science', 'philosophy', 'society', 'economics', 'culture', 'sports'],
    default: 'general'
  },
  tags: [{
    type: String,
    trim: true
  }],
  format: {
    type: String,
    enum: ['open', 'team', 'moderated'],
    default: 'open'
  },
  teams: {
    for: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      role: {
        type: String,
        default: 'member'
      }
    }],
    against: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      role: {
        type: String,
        default: 'member'
      }
    }]
  },
  moderators: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  timeLimit: {
    startTime: Date,
    endTime: Date,
    roundDuration: Number, // in minutes
    speakingTime: Number  // in seconds
  },
  rules: {
    maxParticipantsPerTeam: {
      type: Number,
      default: 5
    },
    requireModeratorApproval: {
      type: Boolean,
      default: false
    },
    allowSpectators: {
      type: Boolean,
      default: true
    }
  },
  voting: {
    enabled: {
      type: Boolean,
      default: true
    },
    votes: {
      for: [{
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User'
        },
        timestamp: {
          type: Date,
          default: Date.now
        }
      }],
      against: [{
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User'
        },
        timestamp: {
          type: Date,
          default: Date.now
        }
      }]
    },
    finalScore: {
      for: {
        type: Number,
        default: 0
      },
      against: {
        type: Number,
        default: 0
      }
    }
  },
  status: {
    type: String,
    enum: ['scheduled', 'active', 'paused', 'closed', 'archived'],
    default: 'active'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  participants: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    role: {
      type: String,
      enum: ['participant', 'spectator', 'moderator'],
      default: 'spectator'
    },
    joinedAt: {
      type: Date,
      default: Date.now
    }
  }],
  statistics: {
    totalMessages: {
      type: Number,
      default: 0
    },
    totalParticipants: {
      type: Number,
      default: 0
    },
    peakConcurrentUsers: {
      type: Number,
      default: 0
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Index for efficient querying
debateSchema.index({ category: 1, status: 1, createdAt: -1 });
debateSchema.index({ tags: 1 });

// Update timestamps
debateSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Virtual for calculating current vote counts
debateSchema.virtual('currentVotes').get(function() {
  return {
    for: this.voting.votes.for.length,
    against: this.voting.votes.against.length
  };
});

export default mongoose.model('Debate', debateSchema); 