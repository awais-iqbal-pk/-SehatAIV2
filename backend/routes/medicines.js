const express = require('express');
const router = express.Router();
const axios = require('axios');
const { protect } = require('../middleware/auth');
const { readMedicineFromImage, buildMasterSystemPrompt, callAI } = require('../utils/aiEngine');
const { checkLimit, incrementUsage } = require('../utils/usageLimiter');
const { performSearch } = require('../utils/search');

router.get('/search', protect, async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.status(400).json({ success: false, message: 'Search term required' });
    const isPremium = req.user.isPremium();
    const limitCheck = await checkLimit(req.user._id, 'medicines', isPremium);
    if (!limitCheck.allowed) return res.status(429).json({ success: false, limitReached: true, message: limitCheck.message, resetIn: limitCheck.resetIn });

    // Step 1: Perform Real-time Background Search
    const searchResults = await performSearch(`latest medical uses dosage and side effects of ${q} in Pakistan`);

    // Step 2: Build Grounded AI Prompt
    const systemPrompt = buildMasterSystemPrompt(req.user, 'MEDICINE_LOOKUP', searchResults);

    // Step 3: Call AI for synthesis
    const aiResult = await callAI({
      messages: [{ role: 'user', content: `Provide detailed information about the medicine: ${q}` }],
      systemPrompt,
      language: req.user.language || 'en'
    });

    let medicines = [];
    if (aiResult.success) {
      medicines = [{
        name: q,
        aiAnalysis: aiResult.response,
        searchResults: searchResults, // For frontend reference/links
        source: 'AI + Real-time Web Search'
      }];
    } else {
      // Fallback to FDA if AI fails
      const r = await axios.get(`https://api.fda.gov/drug/label.json?search=openfda.brand_name:"${encodeURIComponent(q)}"&limit=1`, { timeout: 5000 }).catch(()=>null);
      if (r) {
        medicines = [{ name: q, genericName: r.data.results[0].openfda?.generic_name?.[0], source: 'OpenFDA Fallback' }];
      }
    }

    await incrementUsage(req.user._id, 'medicines');
    res.json({ success: true, data: medicines });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.post('/scan', protect, async (req, res) => {
  try {
    const { imageBase64, language } = req.body;
    if (!imageBase64) return res.status(400).json({ success: false, message: 'Image required' });
    const isPremium = req.user.isPremium();
    const limitCheck = await checkLimit(req.user._id, 'images', isPremium);
    if (!limitCheck.allowed) return res.status(429).json({ success: false, limitReached: true, message: limitCheck.message, resetIn: limitCheck.resetIn });

    const result = await readMedicineFromImage(imageBase64, language || req.user.language || 'en');
    await incrementUsage(req.user._id, 'images');

    if (!result.success && result.error.includes('Key Error')) {
      return res.status(401).json({ success: false, message: result.error });
    }

    res.json({ success: true, data: result.response, aiUsed: result.aiUsed });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

module.exports = router;
