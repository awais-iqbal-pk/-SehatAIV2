const axios = require('axios');

/**
 * SERPER.DEV — Real-time Web Search Integration
 * Used for grounding AI medical knowledge in live data.
 */
const performSearch = async (query) => {
  const apiKey = process.env.SERPER_API_KEY;
  if (!apiKey || apiKey === 'your_serper_api_key_here') {
    console.log('⚠️ Serper API key missing - skipping web search');
    return null;
  }

  try {
    const response = await axios.post('https://google.serper.dev/search',
      { q: query, gl: 'pk' }, // Grounded in Pakistan context
      { headers: { 'X-API-KEY': apiKey, 'Content-Type': 'application/json' }, timeout: 10000 }
    );

    // Extract snippets from organic results
    const results = response.data.organic?.slice(0, 3).map(r => ({
      title: r.title,
      snippet: r.snippet,
      link: r.link
    }));

    return results;
  } catch (err) {
    console.error('Search Error:', err.message);
    return null;
  }
};

module.exports = { performSearch };
