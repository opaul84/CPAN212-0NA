import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  avatar: {
    type: String,
    default: ''
  },
  bio: {
    type: String,
    trim: true,
    maxLength: 500
  },
  reputation: {
    points: {
      type: Number,
      default: 0
    },
    level: {
      type: Number,
      default: 1
    },
    badges: [{
      name: {
        type: String,
        required: true
      },
      description: String,
      category: {
        type: String,
        enum: ['debate', 'moderation', 'contribution', 'achievement']
      },
      earnedAt: {
        type: Date,
        default: Date.now
      }
    }]
  },
  statistics: {
    debatesParticipated: {
      type: Number,
      default: 0
    },
    debatesWon: {
      type: Number,
      default: 0
    },
    debatesModerated: {
      type: Number,
      default: 0
    },
    totalVotesReceived: {
      type: Number,
      default: 0
    },
    bestDebateScore: {
      type: Number,
      default: 0
    }
  },
  preferences: {
    notifications: {
      email: {
        type: Boolean,
        default: true
      },
      desktop: {
        type: Boolean,
        default: true
      }
    },
    privacy: {
      showEmail: {
        type: Boolean,
        default: false
      },
      showStatistics: {
        type: Boolean,
        default: true
      }
    },
    theme: {
      type: String,
      enum: ['light', 'dark', 'system'],
      default: 'system'
    }
  },
  debateHistory: [{
    debate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Debate'
    },
    role: {
      type: String,
      enum: ['participant', 'spectator', 'moderator']
    },
    team: {
      type: String,
      enum: ['for', 'against', 'none'],
      default: 'none'
    },
    performance: {
      votes: Number,
      messages: Number,
      duration: Number // in minutes
    },
    joinedAt: {
      type: Date,
      default: Date.now
    },
    leftAt: Date
  }],
  socialLinks: {
    twitter: String,
    linkedin: String,
    website: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastActive: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Index for efficient querying
userSchema.index({ 'reputation.points': -1 });
userSchema.index({ email: 1 });

// Update lastActive timestamp
userSchema.methods.updateLastActive = function() {
  this.lastActive = new Date();
  return this.save();
};

// Calculate user level based on reputation points
userSchema.methods.calculateLevel = function() {
  this.reputation.level = Math.floor(Math.sqrt(this.reputation.points / 100)) + 1;
  return this.reputation.level;
};

// Add reputation points and recalculate level
userSchema.methods.addReputationPoints = async function(points) {
  this.reputation.points += points;
  this.reputation.level = this.calculateLevel();
  await this.save();
  return this.reputation;
};

// Remove password when converting to JSON
userSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

const User = mongoose.model("User", userSchema);
export default User;
