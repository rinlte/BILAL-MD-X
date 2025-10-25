const { cmd } = require('../command');
const axios = require('axios');

cmd({
  pattern: "gimg",
  desc: "Search Google images using Dexter API",
  react: "🖼️",
  category: "search",
  filename: __filename
}, async (conn, m, store, { from, args, reply }) => {
  if (!args || !args.length) return reply("⚠️ Example: .gimg apple");

  const query = args.join(" ");
  const api = `https://api.id.dexter.it.com/search/google/image?q=${encodeURIComponent(query)}`;

  try {
    const res = await axios.get(api, { timeout: 15000 });
    const data = res.data;

    // kuch API arrays return karti hain — safe fallback
    const results = data.results || data.data || data.items || data || [];
    if (!Array.isArray(results) || results.length === 0)
      return reply("😔 No images found!");

    // sirf pehli image bhejte hain
    const img = results[0].url || results[0].image || results[0].src || results[0];
    if (!img) return reply("⚠️ No image URL found in API response.");

    await conn.sendMessage(from, { image: { url: img }, caption: `🔍 ${query}` }, { quoted: m });
  } catch (err) {
    console.log(err);
    reply("❌ API error: " + err.message);
  }
});
