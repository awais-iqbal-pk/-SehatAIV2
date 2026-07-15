const mongoose = require('mongoose');

const ArchivedDeletionSchema = new mongoose.Schema({
  originalUserId: { type: mongoose.Schema.Types.ObjectId, required: true },
  data: { type: mongoose.Schema.Types.Mixed, required: true }, // Encrypted blob of all user data
  deletedAt: { type: Date, default: Date.now },
}, { timestamps: true });

// TTL Index: Automatically delete from cold storage after 90 days (7,776,000 seconds)
ArchivedDeletionSchema.index({ deletedAt: 1 }, { expireAfterSeconds: 7776000 });

module.exports = mongoose.model('ArchivedDeletion', ArchivedDeletionSchema);
