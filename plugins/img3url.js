const { cmd } = require('../command');
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

cmd({
  pattern: "url",
  react: "🔗",
  desc: "Upload media to Telegraph and get a permanent URL.",
  category: "tools",
  filename: __filename
}, async (conn, mek, store, { from, quoted, mime, reply }) => {
  try {
    const q = quoted || mek;
    const mimeType = (q.msg || q).mimetype || "";
    if (!mimeType) return reply("*📸 Ya 🎥 bhejo aur uspe reply karo likh ke `.url`*");

    const media = await q.download();
    const filePath = `./temp_${Date.now()}.${mimeType.split('/')[1]}`;
    fs.writeFileSync(filePath, media);

    const form = new FormData();
    form.append("file", fs.createReadStream(filePath));

    const upload = await axios.post("https://telegra.ph/upload", form, {
      headers: form.getHeaders()
    });

    const url = "https://telegra.ph" + upload.data[0].src;
    await conn.sendMessage(from, { text: `✅ *Telegraph URL bana liya!* 🔗\n\n${url}` }, { quoted: mek });

    fs.unlinkSync(filePath);
  } catch (err) {
    console.log("---- TELEGRAPH UPLOAD DEBUG ----");
    console.log(err.response ? err.response.status : "NO STATUS");
    console.log(err.response ? err.response.data : err.message);
    console.log("--------------------------------");
    reply("*❌ Kuch galat ho gaya! Dobaara try karo 🥺*");
  }
});
