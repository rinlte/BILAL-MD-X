const fs = require('fs');
const path = require('path');
const { downloadContentFromMessage } = require('@whiskeysockets/baileys');
const { cmd } = require('../command');

cmd({
  pattern: 'setpp',
  alias: ['setprofile', 'setdp'],
  desc: 'Set bot’s profile picture (owner only)',
  category: 'owner',
  react: '🖼️',
  filename: __filename
}, async (conn, m, store, { from, reply }) => {
  try {
    // ✅ Only owner can use this
    if (!m.key.fromMe) {
      return reply('❌ *This command is only for the owner!*');
    }

    // ✅ Check if user replied to an image
    const quoted = m.message?.extendedTextMessage?.contextInfo?.quotedMessage;
    if (!quoted) {
      return reply('⚠️ *Please reply to an image with the command .setpp*');
    }

    // ✅ Extract image message
    const imageMessage = quoted.imageMessage;
    if (!imageMessage) {
      return reply('❌ *The replied message must contain an image!*');
    }

    // 🗂️ Create tmp folder if not exists
    const tmpDir = path.join(process.cwd(), 'tmp');
    if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });

    // 📥 Download image
    const stream = await downloadContentFromMessage(imageMessage, 'image');
    let buffer = Buffer.from([]);
    for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk]);

    const imagePath = path.join(tmpDir, `profile_${Date.now()}.jpg`);
    fs.writeFileSync(imagePath, buffer);

    // 🧠 Update bot’s profile picture
    await conn.updateProfilePicture(conn.user.id, { url: imagePath });

    // 🧹 Delete temp file
    fs.unlinkSync(imagePath);

    await reply('✅ *Successfully updated bot profile picture!*');

  } catch (error) {
    console.error('❌ Error in setpp command:', error);
    await reply('⚠️ *Failed to update profile picture. Please try again later.*');
  }
});
