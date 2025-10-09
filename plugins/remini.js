const { cmd } = require('../command');
const { downloadMediaMessage } = require('@whiskeysockets/baileys');
const fs = require('fs');
const path = require('path');
const remini = require('../lib/remini'); // make sure ../lib/remini.js exists

cmd({
  pattern: 'remini',
  alias: ['hdr', 'dehaze', 'recolor'],
  desc: 'Enhance or improve image quality (AI-based).',
  category: 'image',
  react: '🪄',
  filename: __filename
}, async (conn, mek, m, { reply, args, prefix, command }) => {

  try {
    const quoted = mek.quoted ? mek.quoted : mek;
    const mime = (quoted.msg || quoted).mimetype || '';

    if (!mime) return reply(`❌ Reply to an image with *${prefix + command}*`);
    if (!/image\/(jpe?g|png)/.test(mime)) return reply(`❌ Please reply to a valid image (jpg/png).`);

    await conn.sendMessage(mek.chat, { react: { text: '⏳', key: mek.key } });
    await reply('🪄 *Enhancing image... Please wait...*');

    // Download image to buffer
    const buffer = await downloadMediaMessage(quoted, 'buffer', {}, { reuploadRequest: conn.waUploadToServer });

    if (!Buffer.isBuffer(buffer)) return reply('❌ Failed to download image. Try again.');

    // Detect which type of enhancement to apply
    let enhancementType = 'enhance';
    if (command === 'dehaze') enhancementType = 'dehaze';
    else if (command === 'recolor') enhancementType = 'recolor';
    else if (command === 'hdr') enhancementType = 'enhance';

    // Call AI remini function
    const enhanced = await remini(buffer, enhancementType);

    // Send enhanced image back
    await conn.sendMessage(mek.chat, {
      image: enhanced,
      caption: `✨ *Image Enhanced with ${command.toUpperCase()} Mode*\n_© Powered by TOHID-AI_`
    }, { quoted: mek });

    await conn.sendMessage(mek.chat, { react: { text: '✅', key: mek.key } });

  } catch (err) {
    console.error('Remini command error:', err);
    reply('❌ Something went wrong while processing the image.');
  }
});
