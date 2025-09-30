const axios = require("axios");
const { cmd } = require('../command');

cmd({
  pattern: "gpt",
  alias: ["brain", "question", "answer", "sawal", "jawab", "solution"],
  desc: "AI se jawab lo (multi API fallback)",
  category: "ai",
  react: "🤔"
}, async (conn, mek, m, { body, from }) => {
  try {
    let query = body.replace(/^(gpt|brain|question|answer|sawal|jawab|solution)\s*/i, "").trim();
    if (!query) {
      await conn.sendMessage(from, { react: { text: "😔", key: mek.key } });
      return conn.sendMessage(from, { text: "⚠️ Bhai, pehle apna sawal likho.\n\nExample: gpt Pakistan ka PM kaun hai?" }, { quoted: mek });
    }

    // user ke command msg per react 🤔
    await conn.sendMessage(from, { react: { text: "🤔", key: mek.key } });

    // typing indicator on
    await conn.sendPresenceUpdate("composing", from);

    // fallback API list
    const apis = [
      `https://api.princetechn.com/api/ai/vision?apikey=prince&url=https%3A%2F%2Ffiles.princetech.web.id%2Fimage%2Fmyprince.png&prompt=${encodeURIComponent(query)}`,
      `https://api.princetechn.com/api/ai/mistral?apikey=prince&q=${encodeURIComponent(query)}`,
      `https://api.princetechn.com/api/ai/gpt4o-mini?apikey=prince&q=${encodeURIComponent(query)}`,
      `https://api.princetechn.com/api/ai/openai?apikey=prince&q=${encodeURIComponent(query)}`,
      `https://api.princetechn.com/api/ai/gpt4?apikey=prince&q=${encodeURIComponent(query)}`,
      `https://api.princetechn.com/api/ai/gpt4o?apikey=prince&q=${encodeURIComponent(query)}`,
      `https://api.princetechn.com/api/ai/gpt?apikey=prince&q=${encodeURIComponent(query)}`
    ];

    let finalResponse = null;

    for (let apiUrl of apis) {
      try {
        const { data } = await axios.get(apiUrl, { timeout: 15000 });

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
        console.log("❌ API fail:", apiUrl, err.message || err);
        continue;
      }
    }

    // typing indicator off
    await conn.sendPresenceUpdate("paused", from);

    if (finalResponse) {
      const sent = await conn.sendMessage(from, { text: finalResponse }, { quoted: mek });
      // reply per 😊 react
      await conn.sendMessage(from, { react: { text: "😊", key: sent.key } });
    } else {
      await conn.sendMessage(from, { react: { text: "😔", key: mek.key } });
      await conn.sendMessage(from, { text: "❌ Bhai, sari APIs fail ho gayi. Thora der baad try karo." }, { quoted: mek });
    }

  } catch (e) {
    console.error("GPT CMD Error:", e);
    await conn.sendPresenceUpdate("paused", from);
    await conn.sendMessage(from, { react: { text: "😔", key: mek.key } });
    await conn.sendMessage(from, { text: "⚠️ Bhai, bot ke andar error aa gaya hai." }, { quoted: mek });
  }
});
