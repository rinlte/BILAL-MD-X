const { cmd } = require('../command');
const axios = require('axios');

cmd({
  pattern: "spsearch",
  desc: "Search Spotify songs using Zen API",
  react: "🎧",
  category: "music",
  use: ".spotify <song name>",
  filename: __filename
}, async (conn, m, store, { from, args, reply }) => {
  try {
    if (!args[0]) return reply("🎶 *Please provide a song name!*\nExample: .spotify new songs");

    const query = args.join(" ");
    const apiUrl = `https://api.zenzxz.my.id/api/search/spotify?query=${encodeURIComponent(query)}`;
    
    const { data } = await axios.get(apiUrl);

    if (!data || !data.result || data.result.length === 0)
      return reply("❌ No results found for your query!");

    let txt = `🎵 *SPOTIFY SEARCH RESULTS*\n\n🔍 *Query:* ${query}\n\n`;
    let limit = Math.min(data.result.length, 5); // Show top 5 results only

    for (let i = 0; i < limit; i++) {
      const song = data.result[i];
      txt += `🎧 *Title:* ${song.title || "Unknown"}\n`;
      txt += `👤 *Artist:* ${song.artist || "Unknown"}\n`;
      txt += `🔗 *URL:* ${song.url || "N/A"}\n\n`;
    }

    await reply(txt);
  } catch (err) {
    console.error(err);
    reply("⚠️ Error fetching Spotify results. Please try again later.");
  }
});
