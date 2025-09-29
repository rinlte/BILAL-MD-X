const { cmd } = require('../command');
const config = require('../config');

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
  async (conn, m, store, { from, body, sender, isGroup, isAdmins, isBotAdmins }) => {
    try {
      if (!isGroup || !isBotAdmins) {
        return;
      }
      const args = body.toLowerCase().split(' ')[1];
      if (args === 'delete') {
        config.DELETE_LINKS = 'true';
        await conn.sendMessage(from, { text: 'Antilink enabled' }, { quoted: m });
      } else if (args === 'off') {
        config.DELETE_LINKS = 'false';
        await conn.sendMessage(from, { text: 'Antilink disabled' }, { quoted: m });
      } else if (args === undefined) {
        await conn.sendMessage(from, { text: 'Please specify delete or off' }, { quoted: m });
      }
    } catch (error) {
      console.error(error);
    }
  }
);

cmd({ on: 'body' }, async (conn, m, store, { from, body, sender, isGroup, isAdmins, isBotAdmins }) => {
  try {
    if (!isGroup || isAdmins || !isBotAdmins) {
      return;
    }
    const containsLink = linkPatterns.some(pattern => pattern.test(body));
    if (containsLink && config.DELETE_LINKS === 'true') {
      await conn.sendMessage(from, { delete: m.key }, { quoted: m });
    }
  } catch (error) {
    console.error(error);
  }
});
