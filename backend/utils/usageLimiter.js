/**
 * USAGE LIMITER — Controls free vs premium access
 * ════════════════════════════════════════════════
 * Free users get daily limits that reset at midnight
 * Premium users get unlimited access
 * Shows "cooldown" messages with exact reset time
 */

const mongoose = require('mongoose');

const UsageSchema = new mongoose.Schema({
  userId:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  date:      { type: String, required: true }, // YYYY-MM-DD
  messages:  { type: Number, default: 0 },
  images:    { type: Number, default: 0 },
  medicines: { type: Number, default: 0 },
  consultations: { type: Number, default: 0 },
  lastReset: { type: Date, default: Date.now },
}, { timestamps: true });

const Usage = mongoose.model('Usage', UsageSchema);

// Get today's date string
const today = () => new Date().toISOString().split('T')[0];

// Get reset time (midnight PKT = UTC+5)
const getResetTime = () => {
  const now = new Date();
  const midnight = new Date();
  midnight.setUTCHours(19, 0, 0, 0); // 19:00 UTC = 00:00 PKT
  if (midnight <= now) midnight.setDate(midnight.getDate() + 1);
  const ms = midnight - now;
  const hours   = Math.floor(ms / 3600000);
  const minutes = Math.floor((ms % 3600000) / 60000);
  return { hours, minutes, resetAt: midnight.toISOString() };
};

// Free tier limits
const FREE_LIMITS = {
  messages:      parseInt(process.env.FREE_DAILY_MESSAGES)     || 10,
  images:        parseInt(process.env.FREE_DAILY_IMAGE_SCANS)  || 2,
  medicines:     parseInt(process.env.FREE_MEDICINE_SEARCHES)  || 5,
  consultations: parseInt(process.env.FREE_CONSULTATIONS_PER_DAY) || 3,
};

// Check if user can perform action
const checkLimit = async (userId, action, isPremium) => {
  // ⚡ LIMITS REMOVED FOR TESTING (Bypassed)
  return { allowed: true, remaining: 999, isPremium: true };

  /* Original Limit Logic
  if (isPremium) return { allowed: true, remaining: 999, isPremium: true };
  ...
  */
};

// Increment usage counter
const incrementUsage = async (userId, action) => {
  const todayStr = today();
  await Usage.findOneAndUpdate(
    { userId },
    { $inc: { [action]: 1 }, date: todayStr },
    { upsert: true }
  );
};

// Get user's current usage stats
const getUsageStats = async (userId) => {
  const todayStr = today();
  const usage = await Usage.findOne({ userId });
  if (!usage || usage.date !== todayStr) {
    return { messages: 0, images: 0, medicines: 0, consultations: 0, limits: FREE_LIMITS, resetIn: getResetTime() };
  }
  return {
    messages:      usage.messages,
    images:        usage.images,
    medicines:     usage.medicines,
    consultations: usage.consultations,
    limits:        FREE_LIMITS,
    resetIn:       getResetTime(),
  };
};

module.exports = { checkLimit, incrementUsage, getUsageStats, Usage, FREE_LIMITS };
