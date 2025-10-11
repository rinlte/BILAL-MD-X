const fs = require("fs");
const path = require("path");
const { downloadContentFromMessage } = require("@whiskeysockets/baileys");
const { cmd } = require("../command");

cmd({
  pattern: "setpp",
  alias: ["setprofile", "setdp"],
  desc: "Set bot’s profile picture (Owner only)",
  category: "owner",
  react: "🖼️",
  filename: __filename
}, async (conn, m, store, { from, reply }) => {
  try {
    // ✅ Only owner can use
    if (!m.key.fromMe) {
      return reply("❌ *Only the owner can use this command!*");
    }

    // ✅ Check reply to image
    const quoted = m.message?.extendedTextMessage?.contextInfo?.quotedMessage;
    if (!quoted || !quoted.imageMessage) {
      return reply("⚠️ *Please reply to an image with the command .setpp*");
    }

    // 🗂️ Ensure tmp folder exists
    const tmpDir = path.join(process.cwd(), "tmp");
    if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });

    // 📥 Download the image
    const stream = await downloadContentFromMessage(quoted.imageMessage, "image");
    let buffer = Buffer.from([]);
    for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk]);

    const imagePath = path.join(tmpDir, `profile_${Date.now()}.jpg`);
    fs.writeFileSync(imagePath, buffer);

    // 🧠 Try both possible update methods
    try {
      await conn.query({
        tag: "iq",
        attrs: { to: conn.user.id, type: "set", xmlns: "w:profile:picture" },
        content: [
          {
            tag: "picture",
            attrs: { type: "image" },
            content: buffer
          }
        ]
      });
    } catch {
      // fallback method
      await conn.updateProfilePicture(conn.user.id, { url: imagePath });
    }

    // 🧹 Clean up
    fs.unlinkSync(imagePath);
    await reply("✅ *Profile picture updated successfully!*");

  } catch (error) {
    console.error("❌ Error in setpp:", error);
    await reply("⚠️ *Failed to update profile picture. Please try again later.*");
  }
});
