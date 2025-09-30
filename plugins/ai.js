const axios = require("axios");
const { cmd } = require('../command');

cmd({
  pattern: "ai",
  alias: ["gpt", "chatgpt", "openai"],
  desc: "AI se jawab le",
  category: "ai"
}, async (conn, mek, m, { body, from }) => {
  try {
    const query = body.replace(/^(ai|gpt|chatgpt|openai)\s*/i, ""); // user ka input
    if (!query) return conn.sendMessage(from, { text: "❌ Please enter a query." }, { quoted: mek });

    const url = `https://api.princetechn.com/api/ai/ai?apikey=prince&q=${encodeURIComponent(query)}`;
    const { data } = await axios.get(url);

    if (data.result) {
      await conn.sendMessage(from, { text: data.result }, { quoted: mek });
    } else {
      await conn.sendMessage(from, { text: "❌ No response from AI." }, { quoted: mek });
    }

  } catch (e) {
    console.error(e);
    await conn.sendMessage(from, { text: "⚠️ Error fetching AI response." }, { quoted: mek });
  }
});
