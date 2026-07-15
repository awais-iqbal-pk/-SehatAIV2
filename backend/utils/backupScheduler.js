const cron = require('node-cron');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const User = require('../models/User');
const { Consultation } = require('../models/Models');
const { sendBackupEmail, saveLog } = require('./helpers');

/**
 * AUTOMATED WEEKLY BACKUPS & DATA INTEGRITY
 * Runs every Sunday at midnight (0 0 * * 0)
 */
cron.schedule('0 0 * * 0', async () => {
  console.log('📦 Starting Weekly Database Backup & Stats...');

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupDir = path.join(__dirname, '../backups');
  if (!fs.existsSync(backupDir)) fs.mkdirSync(backupDir);

  const fileName = `backup-${timestamp}.gz`;
  const filePath = path.join(backupDir, fileName);

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('❌ MONGODB_URI not found in environment');
    return;
  }

  // Step 1: Run mongodump
  const command = `mongodump --uri="${uri}" --archive=${filePath} --gzip`;

  exec(command, async (error) => {
    if (error) {
      console.error(`❌ Backup failed: ${error.message}`);
    } else {
      console.log(`✅ Backup successful: ${fileName}`);
    }

    // Step 2: Send stats summary to admin via email
    try {
      const [users, consultations, premium] = await Promise.all([
        User.countDocuments(),
        Consultation.countDocuments(),
        User.countDocuments({ 'subscription.plan': { $ne: 'free' }, 'subscription.status': 'active' })
      ]);

      await sendBackupEmail({ users, consultations, premium, time: new Date().toISOString(), backupFile: fileName });
      await saveLog({ type: 'weekly_backup_sent', data: { users, consultations, premium, backupFile: fileName } });
    } catch (err) {
      console.error('Backup Email Error:', err.message);
    }
  });
});

console.log('🕒 Backup Scheduler initialized (Sundays 00:00)');
