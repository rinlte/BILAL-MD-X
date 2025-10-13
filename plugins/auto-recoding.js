const axios = require("axios");
const { cmd } = require("../command");

cmd({
  pattern: "autorecord",
  desc: "Turn auto recording ON or OFF from WhatsApp",
  category: "tools",
  react: "🎙️",
  filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
  try {
    if (!process.env.HEROKU_API || !process.env.HEROKU_APP_NAME) {
      return reply("⚠️ Heroku vars missing!\nAdd HEROKU_API & HEROKU_APP_NAME in Config Vars.");
    }

    if (!q) return reply("📝 Use like:\n.autorecord on\n.autorecord off");

    const value = q.toLowerCase() === "on" ? "true" : "false";
    const url = `https://api.heroku.com/apps/${process.env.HEROKU_APP_NAME}/config-vars`;

    await reply("⏳ Updating AUTO_RECORDING setting on Heroku...");
    await conn.sendMessage(from, { react: { text: "🔁", key: mek.key } });

    await axios.patch(
      url,
      { AUTO_RECORDING: value },
      {
        headers: {
          Accept: "application/vnd.heroku+json; version=3",
          Authorization: `Bearer ${process.env.HEROKU_API}`,
          "Content-Type": "application/json"
        }
      }
    );

    await reply(`✅ AUTO_RECORDING is now *${value.toUpperCase()}*`);
    await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });

  } catch (err) {
    console.error("❌ Error:", err);
    await reply("⚠️ Kuch ghalat ho gaya bhai, dubara try karo.");
    await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
  }
});
