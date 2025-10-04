const axios = require("axios");
const { cmd } = require("../command"); // tumhare bot ka command system

cmd({
  pattern: "remini",
  desc: "Enhance image quality using API",
  category: "tools",
  filename: __filename
}, async (m, conn) => {
  try {
    // check reply
    let qmsg = m.quoted ? m.quoted : m;
    if (!qmsg || !qmsg.message || !qmsg.message.imageMessage) {
      return conn.sendMessage(m.chat, { text: "📷 *Reply to an image to enhance it!*" }, { quoted: m });
    }

    // download image
    let media = await conn.downloadAndSaveMediaMessage(qmsg);
    let { uploadImage } = require("../lib/uploadImage"); // upload helper
    let url = await uploadImage(media);

    // call API
    let apiUrl = `https://api.princetechn.com/api/tools/remini?apikey=prince&url=${encodeURIComponent(url)}`;
    let response = await axios.get(apiUrl, { responseType: "arraybuffer" });

    // send enhanced image
    await conn.sendMessage(m.chat, { image: Buffer.from(response.data), caption: "✨ Enhanced by *Remini AI*" }, { quoted: m });

  } catch (e) {
    console.error(e);
    conn.sendMessage(m.chat, { text: "❌ Failed to enhance image!" }, { quoted: m });
  }
});
