const { cmd } = require('../command');
const config = require("../config");

// Anti-Link System
const linkPatterns = [
  /https?:\/\/(?:chat\.whatsapp\.com|wa\.me)\/\S+/gi,
  /^https?:\/\/(www\.)?whatsapp\.com\/channel\/([a-zA-Z0-9_-]+)$/,
  /wa\.me\/\S+/gi,
  /https?:\/\/(?:t\.me|telegram\.me)\/\S+/gi,
  /https?:\/\/(?:www\.)?youtube\.com\/\S+/gi,
  /https?:\/\/youtu\.be\/\S+/gi,
  /https?:\/\/(?:www\.)?facebook\.com\/\S+/gi,
  /https?:\/\/fb\.me\/\S+/gi,
  /https?:\/\/(?:www\.)?instagram\.com\/\S+/gi,
  /https?:\/\/(?:www\.)?twitter\.com\/\S+/gi,
  /https?:\/\/(?:www\.)?tiktok\.com\/\S+/gi,
  /https?:\/\/(?:www\.)?linkedin\.com\/\S+/gi,
  /https?:\/\/(?:www\.)?snapchat\.com\/\S+/gi,
  /https?:\/\/(?:www\.)?pinterest\.com\/\S+/gi,
  /https?:\/\/(?:www\.)?reddit\.com\/\S+/gi,
  /https?:\/\/ngl\/\S+/gi,
  /https?:\/\/(?:www\.)?discord\.com\/\S+/gi,
  /https?:\/\/(?:www\.)?twitch\.tv\/\S+/gi,
  /https?:\/\/(?:www\.)?vimeo\.com\/\S+/gi,
  /https?:\/\/(?:www\.)?dailymotion\.com\/\S+/gi,
  /https?:\/\/(?:www\.)?medium\.com\/\S+/gi
];

cmd(
  { on: 'text', pattern: 'antilink', fromMe: true },
  async (conn, m, store, { from, body, sender, isGroup, isAdmins, isBotAdmins, reply }) => {
    try {
      if (!isGroup || !isBotAdmins) {
        return;
      }
      const args = body.split(' ')[1];
      if (args === 'kick') {
        config.ANTI_LINK_KICK = 'true';
        await conn.sendMessage(from, { text: 'Antilink enabled' }, { quoted: m });
      } else if (args === 'off') {
        config.ANTI_LINK_KICK = 'false';
        await conn.sendMessage(from, { text: 'Antilink disabled' }, { quoted: m });
      } else if (args === undefined) {
        await conn.sendMessage(from, { text: 'Please specify kick or off' }, { quoted: m });
      }
    } catch (error) {
      console.error(error);
      reply("*DUBARA KOSHISH KAREIN 🥺❤️*");
    }
  }
);

cmd({ on: 'body' }, async (conn, m, store, { from, body, sender, isGroup, isAdmins, isBotAdmins, reply }) => {
  try {
    if (!isGroup || isAdmins || !isBotAdmins) {
      return;
    }
    const containsLink = linkPatterns.some(pattern => pattern.test(body));
    if (containsLink && config.ANTI_LINK_KICK === 'true') {
      await conn.sendMessage(from, { delete: m.key }, { quoted: m });
      await conn.sendMessage(from, { text: `*HUM GROUP KE ADMINS APKO REMOVE KAR RHE HAI Q K AP LINKS BHEJ RAHE HAI AUR IS GROUP ME LINKS ALLOWED NAHI*\n@${sender.split('@')[0]} has been removed. 🚫`, mentions: [sender] }, { quoted: m });
      await conn.groupParticipantsUpdate(from, [sender], "remove");
    }
  } catch (error) {
    console.error(error);
    reply("*DUBARA KOSHISH KAREIN 🥺❤️*");
  }
});
