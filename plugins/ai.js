const axios = require('axios');
const fetch = require('node-fetch');
const { cmd } = require('../command');

cmd({
  pattern: "gpt",
  alias: ["ai", "gemini", "chatgpt", "openai", "sawal", "jawab", "jawab", "question", "answer", "g", "gp", "gpt1"],
  desc: "Chat with AI (GPT or Gemini)",
  category: "ai",
  react: "🤔",
  filename: __filename
}, async (conn, m, store, { from, q, reply }) => {
  try {
    if (!q) return reply("*APKO KISI SAWAL KA JAWAB PUCHNA HAI TO ESE LIKHO ☺️🌹* \n *.GPT ❮APNA SAWAL YAHA LIKHO❯* \n *TO APKO SAWAL KA JAWAB MIL JAYE GA ☺️💓*`");

    // ⏳ React while processing
    await conn.sendMessage(from, { react: { text: "🤔", key: m.key } });

    let answer = null;

    // ✅ Try GPT API first
    try {
      const res = await axios.get(`https://api.dreaded.site/api/chatgpt?text=${encodeURIComponent(q)}`);
      if (res.data?.success && res.data?.result?.prompt) {
        answer = res.data.result.prompt;
      }
    } catch (e) {
      console.log("GPT API Failed:", e.message);
    }

    // 🔄 Try Gemini APIs if GPT fails
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

    // 📤 Send AI reply
    if (answer) {
      await conn.sendMessage(from, { text: `*APKE SAWAL KA JAWAB 🥰🌹*\n\n${answer}` }, { quoted: m });
      await conn.sendMessage(from, { react: { text: "☺️", key: m.key } });
    } else {
      await reply("*APKE SAWAL KA JAWAB NAHI MERE PASS 🥺🌹*");
      await conn.sendMessage(from, { react: { text: "😔", key: m.key } });
    }

  } catch (error) {
    console.error("*APKE SAWAL KA JAWAB NAHI MERE PASS 🥺🌹*", error);
    await conn.sendMessage(from, { text: "*APKE SAWAL KA JAWAB NAHI MERE PASS 🥺🌹*" }, { quoted: m });
    await conn.sendMessage(from, { react: { text: "😔", key: m.key } });
  }
});
