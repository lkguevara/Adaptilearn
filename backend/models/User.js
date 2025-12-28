import mongoose from "mongoose";

const achievementSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    enum: [
      'first_topic_completed',
      'roadmap_25_percent',
      'roadmap_50_percent',
      'roadmap_75_percent',
      'roadmap_completed',
      'five_roadmaps_started',
      'ten_topics_completed',
      'create_first_roadmap'
    ]
  },
  unlockedAt: {
    type: Date,
    default: Date.now
  },
  description: String,
  icon: String
}, { _id: false });

const userStatsSchema = new mongoose.Schema({
  totalTopicsCompleted: {
    type: Number,
    default: 0
  },
  totalRoadmapsStarted: {
    type: Number,
    default: 0
  },
  totalRoadmapsCompleted: {
    type: Number,
    default: 0
  },
  totalStudyMinutes: {
    type: Number,
    default: 0
  },
  averageCompletionRate: {
    type: Number,
    default: 0
  },
  lastActivityDate: Date,
  longestStreak: {
    type: Number,
    default: 0
  },
  currentStreak: {
    type: Number,
    default: 0
  },
  preferredTopics: [String],
  learningVelocity: {
    type: String,
    enum: ['slow', 'medium', 'fast'],
    default: 'medium'
  }
}, { _id: false });

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: true
    },
    achievements: [achievementSchema],
    stats: userStatsSchema
  },
  {
    timestamps: true
  }
);

const User = mongoose.model("User", userSchema);

export default User;
