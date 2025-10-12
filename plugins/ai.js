const axios = require('axios');
const fetch = require('node-fetch');
const { cmd } = require('../command');

// ===================================
// 🤖 AI COMMAND (.gpt / .gemini)
// ===================================
cmd({
  pattern: "gpt",
  alias: ["ai", "gemini", "chatgpt"],
  desc: "Chat with AI (GPT or Gemini)",
  category: "ai",
  react: "🤖",
  filename: __filename
}, async (conn, m, store, { from, q, reply }) => {
  try {
    if (!q) return reply("❌ *Please provide a question.*\n\nExample: `.gpt write a love poem`");

    // 🤔 React while processing
    await conn.sendMessage(from, {
      react: { text: "🤖", key: m.key }
    });

    let answer = null;

    // =======================
    // 🔹 GPT API (Dreaded)
    // =======================
    if (m.body.startsWith('.gpt') || m.body.startsWith('gpt')) {
      try {
        const res = await axios.get(`https://api.dreaded.site/api/chatgpt?text=${encodeURIComponent(q)}`);
        if (res.data && res.data.success && res.data.result?.prompt) {
          answer = res.data.result.prompt;
        }
      } catch (e) {
        console.error("GPT API failed:", e);
      }
    }

    // =======================
    // 🔹 Gemini APIs (Fallback)
    // =======================
    if (!answer) {
      const geminiAPIs = [
        `https://vapis.my.id/api/gemini?q=${encodeURIComponent(q)}`,
        `https://api.siputzx.my.id/api/ai/gemini-pro?content=${encodeURIComponent(q)}`,
        `https://api.ryzendesu.vip/api/ai/gemini?text=${encodeURIComponent(q)}`,
        `https://api.dreaded.site/api/gemini2?text=${encodeURIComponent(q)}`,
        `https://api.giftedtech.my.id/api/ai/geminiai?apikey=gifted&q=${encodeURIComponent(q)}`,
        `https://api.giftedtech.my.id/api/ai/geminiaipro?apikey=gifted&q=${encodeURIComponent(q)}`
      ];

      for (const api of geminiAPIs) {
        try {
          const r = await fetch(api);
          const data = await r.json();

          if (data.message || data.data || data.answer || data.result) {
            answer = data.message || data.data || data.answer || data.result;
            break;
          }
        } catch (err) {
          continue;
        }
      }
    }

    // =======================
    // 📤 Send the AI Response
    // =======================
    if (answer) {
      await conn.sendMessage(from, {
        text: `🤖 *AI Response:*\n\n${answer}`,
        contextInfo: { quotedMessage: m.message }
      }, { quoted: m });
    } else {
      reply("⚠️ Sorry, all AI APIs failed to respond. Please try again later.");
    }

  } catch (error) {
    console.error("AI Command Error:", error);
    reply("❌ Error occurred while processing your request.");
  }
});
