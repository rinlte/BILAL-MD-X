const { cmd } = require('../command');
const { Sticker, StickerTypes } = require("wa-sticker-formatter");
const Config = require('../config');

// 🎨 Take / Rename Sticker Command
cmd(
  {
    pattern: 'take',
    alias: ['rename', 'stake'],
    desc: 'Sticker ka name apne name se change kare.',
    category: 'sticker',
    use: '<reply sticker> <new name>',
    filename: __filename,
  },
  async (conn, mek, m, { quoted, args, q, reply, from }) => {
    try {
      // 🥺 React on command
      await conn.sendMessage(from, { react: { text: '🥺', key: m.key } });

      // ⚠️ Agar koi sticker reply nahi kiya
      if (!mek.quoted) {
        await conn.sendMessage(from, { react: { text: '😥', key: m.key } });
        return reply(
          `*PEHLE KISI BHI STICKER KO MENTION KARO 🥺*\n\n` +
          `*PHIR ESE LIKHO ☺️*  \n\n *TAKE ❮APKA NAME❯*\n\n` +
          `*IS SE STICKER APKE NAME KA BAN JAYE GA ☺️🌹*`
        );
      }

      // ⚠️ Agar name nahi diya
      if (!q) {
        await conn.sendMessage(from, { react: { text: '😥', key: m.key } });
        return reply(
          `*APNA NAME LIKHO JAISE 😊*\n\n` +
          `*.take MADE BY <APKA NAME>*\n\n` +
          `*IS TARAH LIKHNE SE STICKER APKE NAME KA HO JAYE GA 🌹*`
        );
      }

      const mime = mek.quoted.mtype;
      const pack = q;

      // ✅ Sticker Type Check
      if (mime === "imageMessage" || mime === "stickerMessage") {

        // ⏳ Waiting message
        const waitMsg = await conn.sendMessage(from, {
          text: `*APKA STICKER READY HO RAHA HAI ☺️*\n*THORA SA INTAZAR KARE......😇*`,
          quoted: mek
        });

        const media = await mek.quoted.download();
        const sticker = new Sticker(media, {
          pack: pack,
          type: StickerTypes.FULL,
          categories: ["🤩", "🎉"],
          id: "12345",
          quality: 75,
          background: 'transparent',
        });

        const buffer = await sticker.toBuffer();

        // 🎉 Send sticker
        await conn.sendMessage(from, { sticker: buffer }, { quoted: mek });

        // ☺️ Success react
        await conn.sendMessage(from, { react: { text: '☺️', key: m.key } });

        // 🧹 Delete waiting msg after success
        await new Promise(r => setTimeout(r, 2000));
        await conn.sendMessage(from, { delete: waitMsg.key });

      } else {
        await conn.sendMessage(from, { react: { text: '😥', key: m.key } });
        return reply("*SIRF STICKER KO MENTION KARO BAS 🥺*");
      }

    } catch (error) {
      console.error("*DUBARA KOSHISH KARE 🥺*", error);
      await conn.sendMessage(from, { react: { text: '😔', key: m.key } });
      return reply("*DUBARA KOSHISH KARE 🥺*");
    }
  }
);
