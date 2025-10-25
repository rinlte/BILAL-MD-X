const { cmd } = require('../command');
const axios = require('axios');
const FormData = require('form-data');

cmd({
  pattern: "3url",
  desc: "Convert any image or video to a direct permanent Telegraph URL.",
  react: "🔗",
  category: "tools",
  filename: __filename
}, async (conn, m, store, { from, quoted, reply }) => {
  try {
    const q = quoted || m;
    const mime = (q.msg || q.message)?.mimetype || '';

    if (!mime)
      return reply("📸 Reply to an image or video to generate a link.");

    await conn.sendMessage(from, { react: { text: "⏳", key: m.key } });
    reply("🪄 Uploading your media to Telegraph...");

    // Download media buffer
    const buffer = await q.download();

    // Determine file extension
    const ext = mime.split('/')[1];
    const filename = `upload.${ext}`;

    // Prepare form-data
    const form = new FormData();
    form.append('file', buffer, { filename });

    // Upload to Telegraph
    const res = await axios.post('https://telegra.ph/upload', form, {
      headers: form.getHeaders(),
    });

    if (!Array.isArray(res.data) || !res.data[0]?.src)
      throw new Error("Invalid response from Telegraph.");

    const link = `https://telegra.ph${res.data[0].src}`;
    const size = formatBytes(buffer.length);

    const msg = `乂  *UPLOAD SUCCESSFUL*  乂\n\n` +
      `*📁 Type:* ${mime}\n` +
      `*🔗 Link:* ${link}\n` +
      `*💾 Size:* ${size}\n` +
      `*🕐 Expiry:* Never\n\n` +
      `> _Powered by Bilal-MD_`;

    await conn.sendMessage(from, { text: msg }, { quoted: m });
    await conn.sendMessage(from, { react: { text: "✅", key: m.key } });

  } catch (err) {
    console.error("Telegraph Upload Error:", err.response?.data || err.message);
    reply("❌ Kuch galat ho gaya! Dobaara try karo 🥺");
    await conn.sendMessage(from, { react: { text: "💥", key: m.key } });
  }
});

// 📏 Convert bytes to readable size
function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return (bytes / Math.pow(1024, i)).toFixed(2) + ' ' + units[i];
}
