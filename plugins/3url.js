const { cmd } = require('../command');
const fetch = require('node-fetch');
const uploadImage = require('../lib/uploadImage.js');
const uploadFile = require('../lib/uploadFile.js');

cmd({
  pattern: "3url",
  desc: "Convert any image or video to a direct URL (Telegraph-based).",
  react: "🔗",
  category: "tools",
  filename: __filename
}, async (conn, m, store, { from, quoted, mime, reply }) => {
  try {
    const q = quoted || m;
    const mimetype = (q.msg || q.message)?.mimetype || '';

    if (!mimetype)
      return reply("🌸 Please reply to an *image* or *video*.");

    await conn.sendMessage(from, { react: { text: "⏳", key: m.key } });
    reply("🌸 Converting the media to a permanent URL...");

    // Download buffer
    const buffer = await q.download();

    // Detect file type
    const isImage = /image\/(png|jpe?g|gif)/.test(mimetype);
    const isVideo = /video\/mp4/.test(mimetype);

    if (!isImage && !isVideo)
      return reply("❌ Unsupported file type!");

    // Upload media (Telegraph or similar)
    const mediaLink = await (isImage ? uploadImage(buffer) : uploadFile(buffer));
    const shortLink = await shortenUrl(mediaLink);
    const size = formatBytes(buffer.length);

    const msg = `乂  *LINK DETAILS*  乂\n\n` +
      `*» Link:* ${mediaLink}\n` +
      `*» Shortened:* ${shortLink}\n` +
      `*» Size:* ${size}\n` +
      `*» Expiration:* Does not expire\n\n` +
      `> *Powered by Bilal-MD*`;

    await conn.sendMessage(from, { text: msg }, { quoted: m });
    await conn.sendMessage(from, { react: { text: "✅", key: m.key } });

  } catch (err) {
    console.error(err);
    reply("🌸 An error occurred. Try again!");
    await conn.sendMessage(from, { react: { text: "❌", key: m.key } });
  }
});

// 📏 Convert bytes to readable size
function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return (bytes / Math.pow(1024, i)).toFixed(2) + ' ' + units[i];
}

// 🔗 URL shortener using tinyurl API
async function shortenUrl(url) {
  const res = await fetch('https://tinyurl.com/api-create.php?url=' + url);
  return await res.text();
}
