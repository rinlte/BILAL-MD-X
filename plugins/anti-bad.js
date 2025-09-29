const { cmd } = require('../command');
const config = require("../config");

// Anti-Bad Words System
cmd(
  { on: 'text', pattern: 'antibad', fromMe: true },
  async (conn, m, store, { from, body, sender, isGroup, isAdmins, isBotAdmins, reply }) => {
    try {
      if (!isGroup || !isBotAdmins) {
        return;
      }
      const args = body.split(' ')[1];
      if (args === 'on') {
        config.ANTI_BAD_WORD = 'true';
        await conn.sendMessage(from, { text: 'Antibad enabled' }, { quoted: m });
      } else if (args === 'off') {
        config.ANTI_BAD_WORD = 'false';
        await conn.sendMessage(from, { text: 'Antibad disabled' }, { quoted: m });
      } else if (args === undefined) {
        await conn.sendMessage(from, { text: 'Please specify on or off' }, { quoted: m });
      }
    } catch (error) {
      console.error(error);
      reply("*DUBARA KOSHISH KAREIN 🥺❤️*");
    }
  }
);

cmd({ on: 'body' }, async (conn, m, store, { from, body, isGroup, isAdmins, isBotAdmins, reply, sender }) => {
  try {
    const badWords = ["phuda", "phudi", "xxx", "fuck", 'sex', "huththa", "", 'sexy', "sex"];
    if (!isGroup || isAdmins || !isBotAdmins) {
      return;
    }
    const messageText = body.toLowerCase();
    const containsBadWord = badWords.some(word => messageText.includes(word));
    if (containsBadWord && config.ANTI_BAD_WORD === "true") {
      await conn.sendMessage(from, { delete: m.key }, { quoted: m });
      await conn.sendMessage(from, { text: `*AP GANDE ALFAZ NA BOLE PLEZ 🙏🥺*\n@${sender.split('@')[0]}`, mentions: [sender] }, { quoted: m });
    }
  } catch (error) {
    console.error(error);
    reply("*DUBARA KOSHISH KAREIN 🥺❤️*");
  }
});
