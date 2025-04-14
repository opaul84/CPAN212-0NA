import mongoose from 'mongoose';

const achievementSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['debate', 'moderation', 'contribution', 'special'],
    required: true
  },
  type: {
    type: String,
    enum: ['badge', 'trophy', 'milestone'],
    default: 'badge'
  },
  icon: {
    type: String,
    required: true
  },
  criteria: {
    type: {
      type: String,
      enum: ['count', 'score', 'time', 'special'],
      required: true
    },
    requirement: {
      type: Number,
      required: true
    },
    metric: {
      type: String,
      enum: [
        'debates_participated',
        'debates_won',
        'debates_moderated',
        'votes_received',
        'reputation_points',
        'consecutive_days',
        'messages_sent'
      ],
      required: true
    }
  },
  rewards: {
    reputationPoints: {
      type: Number,
      default: 0
    },
    specialPerks: [{
      type: String
    }]
  },
  rarity: {
    type: String,
    enum: ['common', 'uncommon', 'rare', 'epic', 'legendary'],
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  earnedBy: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    earnedAt: {
      type: Date,
      default: Date.now
    },
    progress: {
      current: Number,
      required: Number
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Indexes for efficient querying
achievementSchema.index({ category: 1, type: 1 });
achievementSchema.index({ 'earnedBy.user': 1 });
achievementSchema.index({ rarity: 1 });

// Method to check if a user has earned this achievement
achievementSchema.methods.isEarnedByUser = function(userId) {
  return this.earnedBy.some(entry => entry.user.equals(userId));
};

// Method to award achievement to user
achievementSchema.methods.awardToUser = async function(userId, progress) {
  if (!this.isEarnedByUser(userId)) {
    this.earnedBy.push({
      user: userId,
      progress: progress
    });
    await this.save();

    // Get user and update their badges
    const User = mongoose.model('User');
    const user = await User.findById(userId);
    
    user.reputation.badges.push({
      name: this.name,
      description: this.description,
      category: this.category
    });

    // Add reputation points if specified
    if (this.rewards.reputationPoints > 0) {
      await user.addReputationPoints(this.rewards.reputationPoints);
    }

    await user.save();
    return true;
  }
  return false;
};

// Static method to check and award achievements for a user
achievementSchema.statics.checkAndAwardAchievements = async function(userId, metric, value) {
  const achievements = await this.find({
    isActive: true,
    'criteria.metric': metric,
    'earnedBy.user': { $ne: userId }
  });

  const awarded = [];
  for (const achievement of achievements) {
    if (value >= achievement.criteria.requirement) {
      await achievement.awardToUser(userId, { current: value, required: achievement.criteria.requirement });
      awarded.push(achievement);
    }
  }

  return awarded;
};

export default mongoose.model('Achievement', achievementSchema); 