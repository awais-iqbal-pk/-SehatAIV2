const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/auth');
const { getUsageStats } = require('../utils/usageLimiter');
const { saveLog } = require('../utils/helpers');
const ArchivedDeletion = require('../models/ArchivedDeletion');
const { Consultation, Appointment, Payment, Review, Vitals } = require('../models/Models');

// GET /api/users/vitals
router.get('/vitals', protect, async (req, res) => {
  try {
    const data = await Vitals.find({ userId: req.user._id }).sort({ recordedAt: 1 });
    res.json({ success: true, data });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// POST /api/users/vitals
router.post('/vitals', protect, async (req, res) => {
  try {
    const { type, value, numericValue, unit } = req.body;
    const reading = await Vitals.create({ userId: req.user._id, type, value, numericValue, unit });
    res.status(201).json({ success: true, data: reading });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.get('/me', protect, async (req, res) => {
  const stats = await getUsageStats(req.user._id).catch(()=>({}));
  res.json({ success: true, user: req.user.getPublicProfile(), usageStats: stats });
});

router.put('/me', protect, async (req, res) => {
  try {
    const allowed = ['name','age','gender','city','language','avatar','notifications'];
    const updates = {};
    allowed.forEach(f => { if (req.body[f] !== undefined) updates[f] = req.body[f]; });
    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true });
    res.json({ success: true, user: user.getPublicProfile() });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.put('/health-profile', protect, async (req, res) => {
  try {
    const { existingConditions, allergies, currentMedicines, emergencyContact, bloodGroup } = req.body;
    const user = await User.findByIdAndUpdate(req.user._id, {
      bloodGroup, healthProfile: { existingConditions, allergies, currentMedicines, emergencyContact }
    }, { new: true });
    await saveLog({ type: 'health_profile_updated', userId: req.user._id, data: { bloodGroup } });
    res.json({ success: true, user: user.getPublicProfile() });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.put('/language', protect, async (req, res) => {
  try {
    const { language } = req.body;
    if (!['en','ur'].includes(language)) return res.status(400).json({ success: false, message: 'Invalid language' });
    await User.findByIdAndUpdate(req.user._id, { language });
    res.json({ success: true, language });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.delete('/account', protect, async (req, res) => {
  try {
    const userId = req.user._id;

    // Step 1: Collect all data for cold storage backup
    const [consultations, appointments, payments, reviews] = await Promise.all([
      Consultation.find({ userId }),
      Appointment.find({ userId }),
      Payment.find({ userId }),
      Review.find({ userId })
    ]);

    const userBlob = {
      profile: req.user.toObject(),
      consultations,
      appointments,
      payments,
      reviews
    };

    // Step 2: Move to ArchivedDeletions (TTL will purge in 90 days)
    await ArchivedDeletion.create({
      originalUserId: userId,
      data: userBlob // Encrypted fields within these objects remain encrypted
    });

    // Step 3: Hard delete from production collections
    await Promise.all([
      User.findByIdAndDelete(userId),
      Consultation.deleteMany({ userId }),
      Appointment.deleteMany({ userId }),
      Payment.deleteMany({ userId }),
      Review.deleteMany({ userId })
    ]);

    await saveLog({ type: 'account_deleted', userId, data: { status: 'HARD_DELETE_ARCHIVED_90_DAYS' } });

    res.json({ success: true, message: 'Account and data permanently deleted from live servers. Backed up for 90 days for legal compliance.' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

module.exports = router;
