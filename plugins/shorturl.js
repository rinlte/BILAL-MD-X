const { cmd } = require("../command");
const axios = require("axios");

cmd({
  pattern: "shorurl",
  alias: ["short", "shr"],
  desc: "Shorten a URL using ulvis.net",
  category: "tools",
  react: "🔗",
  filename: __filename
}, async (conn, m, store, { args, reply }) => {
  try {
    if (!args[0]) {
      return reply("⚠️ Please send a URL. Example:\n.shorten https://example.com");
    }
    const longUrl = args[0];
    const apiUrl = "https://ulvis.net/api/v1/shorten";
    const response = await axios.post(apiUrl, { url: longUrl });
    const data = response.data;
    if (data && data.shortUrl) {
      await conn.sendMessage(m.chat, {
        text: `🔗 Shortened URL:\n${data.shortUrl}`
      }, { quoted: m });
    } else {
      reply("❌ Failed to shorten. Response: " + JSON.stringify(data));
    }
  } catch (err) {
    console.error("Shorten command error:", err.message);
    reply("❌ Error while shortening URL. Try again later.");
  }
});
