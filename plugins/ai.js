const axios = require("axios");
const { cmd } = require('../command');

cmd({
  pattern: "ai",
  alias: ["chatgpt", "ask", "openai", "brain", "question", "answer", "sawal", "jawab", "solution"],
  desc: "AI se jawab lo (multi API fallback)",
  category: "ai",
  react: "🤔"
}, async (conn, mek, m, { body, from }) => {
  try {
    let query = body.replace(/^(ai|chatgpt|ask|openai|brain|question|answer|sawal|jawab|solution)\s*/i, "").trim();
    if (!query) {
      await conn.sendMessage(from, { react: { text: "😔", key: mek.key } });
      return conn.sendMessage(from, { text: "❌ Please enter a query.\n\nExample: ai who are you?" }, { quoted: mek });
    }

    // react on user command msg 🤔
    await conn.sendMessage(from, { react: { text: "🤔", key: mek.key } });

    // fallback API list
    const apis = [
      `https://api.princetechn.com/api/ai/ai?apikey=prince&q=${encodeURIComponent(query)}`,
      `https://api.princetechn.com/api/ai/chat?apikey=prince&q=${encodeURIComponent(query)}`,
      `https://api.giftedapis.us.kg/ai/gpt?apikey=gifted&q=${encodeURIComponent(query)}`
    ];

    let finalResponse = null;

    for (let apiUrl of apis) {
      try {
        const { data } = await axios.get(apiUrl, { timeout: 10000 });

        if (data.result && data.result.toString().trim()) {
          finalResponse = data.result;
        } else if (data.reply && data.reply.toString().trim()) {
          finalResponse = data.reply;
        } else if (data.answer && data.answer.toString().trim()) {
          finalResponse = data.answer;
        } else if (data.choices?.[0]?.message?.content) {
          finalResponse = data.choices[0].message.content;
        }

        if (finalResponse) break;
      } catch (err) {
        console.log("API failed:", apiUrl, err.message || err);
        continue;
      }
    }

    if (finalResponse) {
      const sent = await conn.sendMessage(from, { text: finalResponse }, { quoted: mek });
      // reply msg per 😊 react
      await conn.sendMessage(from, { react: { text: "😊", key: sent.key } });
    } else {
      await conn.sendMessage(from, { react: { text: "😔", key: mek.key } });
      await conn.sendMessage(from, { text: "❌ All APIs failed. Please try later." }, { quoted: mek });
    }

  } catch (e) {
    console.error("AI CMD Error:", e);
    await conn.sendMessage(from, { react: { text: "😔", key: mek.key } });
    await conn.sendMessage(from, { text: "⚠️ Internal Error while fetching AI response." }, { quoted: mek });
  }
});
