/**
 * SEHAT-AI MASTER SYSTEM PROMPT & CONTEXT ENGINE (v2.0)
 * Optimized for Gemini 1.5 Flash (Google AI Studio)
 */
const axios = require('axios');

const buildMasterSystemPrompt = (userContext, moduleType, searchResults = null) => {
  const baseInstructions = `
You are Sehat-AI, an advanced, highly secure, and empathetic clinical AI assistant.
Your primary responsibility is to provide evidence-based healthcare insights while
respecting patient privacy and data integrity.

### 1. USER IDENTITY & HEALTH RECORD CONTEXT
All responses must be personalized using the following linked patient data
(UserID: ${userContext.userId}):
- Demographics: Age: ${userContext.age || 'N/A'}, Gender: ${userContext.gender || 'N/A'}
- Vital Trends: BP: ${userContext.latestBP || 'Normal'}, Sugar: ${userContext.latestSugar || 'Normal'}, Weight: ${userContext.weight || 'N/A'}
- Medical History: Diagnosed Diseases: ${JSON.stringify(userContext.diseases || [])}
- Active Prescriptions & Medicines: ${JSON.stringify(userContext.medicines || [])}
- Recent Doctor Visits & Reports: ${JSON.stringify(userContext.recentVisits || [])}
- Vaccination History: ${JSON.stringify(userContext.vaccinations || [])}

### 2. STRICT MEDICAL RESPONSE FORMATTING
When discussing symptoms, diagnoses, or medications, you MUST strictly follow this
structured clinical format:
1. CLINICAL SUMMARY: A 2-3 sentence high-level overview of the health query or medication.
2. EVIDENCE-BASED ANALYSIS: Detailed breakdown of physiological factors, drug interactions, or symptom pathways.
3. RISK FACTORS & CONTRAINDICATIONS: Highlight warnings based on history.
4. RECOMMENDED ACTION PLAN: Specific actionable next steps.
5. RED FLAG SYMPTOMS: Emergency signs.

FORMATTING RULES:
- Use **Bold Headings** for each section.
- Use Bullet Points (•) for lists.
- Keep sentences clear and professional.
- Ensure high engagement with empathetic language.
`;

  let moduleInstructions = "";
  switch (moduleType) {
    case "PREGNANCY":
      moduleInstructions = `### MODULE: OBSTETRICS & MATERNAL CARE\n- Gestational Stage: Week ${userContext.pregnancyWeek || 'Unspecified'}.\n- Focus on maternal well-being and fetal development.`;
      break;
    case "ELDERLY":
      moduleInstructions = `### MODULE: GERIATRIC & CHRONIC CARE\n- Prioritize medication management and fall prevention.`;
      break;
    case "MEDICINE_LOOKUP":
      moduleInstructions = `### MODULE: PHARMACOLOGICAL EXPERT\n- Synthesize data with current prescriptions to check interactions.`;
      break;
    case "BODY_DIAGRAM":
      moduleInstructions = `### MODULE: ANATOMICAL SYMPTOM CHECKER\n- Target Area: ${userContext.selectedBodyPart}.\n- Ask targeted questions about pain quality and duration.`;
      break;
    default:
      moduleInstructions = `### MODULE: GENERAL CONSULTATION\nProvide balanced healthcare guidance.`;
  }

  const searchContext = searchResults
    ? `\n### 3. REAL-TIME SEARCH DATA: \n${JSON.stringify(searchResults)}\nUse this to ensure accuracy.`
    : "";

  return `${baseInstructions}\n${moduleInstructions}\n${searchContext}`;
};

const callAI = async ({ messages, systemPrompt, imageBase64, language = 'en' }) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    console.error('❌ CRITICAL: GEMINI_API_KEY is missing or invalid in .env');
    return { success: false, response: "AI Error: API Key Missing", aiUsed: 'none' };
  }

  try {
    const model = imageBase64 ? 'gemini-1.5-flash' : (process.env.GEMINI_MODEL || 'gemini-1.5-flash');
    const url = `https://generativelanguage.googleapis.com/v1/models/${model}:generateContent?key=${apiKey}`;

    // Step 1: Clean and alternate messages for Gemini
    const contents = [];
    messages.forEach((m) => {
      const role = m.role === 'ai' || m.role === 'model' ? 'model' : 'user';
      if (contents.length > 0 && contents[contents.length - 1].role === role) {
        // Merge same roles
        contents[contents.length - 1].parts[0].text += `\n\n${m.content}`;
      } else {
        contents.push({ role, parts: [{ text: m.content || "..." }] });
      }
    });

    // Ensure the conversation starts with a 'user' message (Gemini rule)
    if (contents.length > 0 && contents[0].role === 'model') {
       contents.unshift({ role: 'user', parts: [{ text: "Start conversation." }] });
    }

    // Add image to the last user message
    if (imageBase64) {
      let lastUser = [...contents].reverse().find(c => c.role === 'user');
      if (lastUser) {
        lastUser.parts.push({ inline_data: { mime_type: 'image/jpeg', data: imageBase64 } });
      }
    }

    // Step 2: Payload with official systemInstruction parameter
    const payload = {
      systemInstruction: {
        parts: [{ text: systemPrompt }]
      },
      contents: contents,
      generationConfig: {
        temperature: 0.4,
        maxOutputTokens: 2048,
        topP: 0.8,
        topK: 40
      }
    };

    console.log('🤖 Sending request to Google Gemini API...');
    const response = await axios.post(url, payload, { timeout: 60000 });

    const aiText = response.data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!aiText) {
      console.error('⚠️ Empty response from Gemini. Data:', JSON.stringify(response.data));
      // Log safety ratings if blocked
      if (response.data.promptFeedback?.blockReason) {
        console.error('🚫 Blocked by Google Safety Filters:', response.data.promptFeedback.blockReason);
      }
      throw new Error('Google returned an empty or restricted response.');
    }

    console.log('✅ Gemini responded successfully.');
    return { success: true, response: aiText, aiUsed: 'Gemini 1.5 Flash' };

  } catch (err) {
    const status = err.response?.status;
    const errorData = err.response?.data;

    console.error(`\n❌ GEMINI API ERROR [Status ${status || 'N/A'}]:`);
    console.error(JSON.stringify(errorData || err.message, null, 2));

    let userFriendlyMsg = "AI is currently busy. Please try again in a moment.";

    if (status === 400) userFriendlyMsg = "Error in message formatting. Let's start a new chat.";
    if (status === 401 || status === 403) userFriendlyMsg = "Invalid API Key. Please check your .env file.";
    if (status === 429) userFriendlyMsg = "Free limit reached. Please wait 60 seconds.";
    if (status === 500) userFriendlyMsg = "Google's AI servers are currently down.";

    return { success: false, response: userFriendlyMsg, error: err.message };
  }
};

const getAvailableProviders = () => [{ key: 'gemini', name: 'Gemini 1.5 Flash' }];

module.exports = { buildMasterSystemPrompt, callAI, getAvailableProviders };
