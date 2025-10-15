
cmd(
    {
        pattern: 'sticker',
        alias: ['s', 'stickergif'],
        desc: 'Create a sticker from an image, video, or URL.',
        category: 'sticker',
        use: '<reply media or URL>',
        filename: __filename,
    },
    async (conn, mek, m, { quoted, args, q, reply, from }) => {
        if (!mek.quoted) return reply(`*AP KISI PHOTO , VIDEO KO MENTION KARO AUR PHIR LIKHO ☺️🌹* \n STICKER* \n *JAB AP STICKER LIKHO GE TO APKI PHOTO YA VIDEO STICKER BAN JAYE GE OK 😊❤️*`);
        let mime = mek.quoted.mtype;
        let pack = Config.STICKER_NAME || "👑 BILAL-MD 👑";
        
        if (mime === "imageMessage" || mime === "stickerMessage") {
            let media = await mek.quoted.download();
            let sticker = new Sticker(media, {
                pack: pack, 
                type: StickerTypes.FULL,
                categories: ["🤩", "🎉"], 
                id: "12345",
                quality: 75, 
                background: 'transparent',
            });
            const buffer = await sticker.toBuffer();
            return conn.sendMessage(mek.chat, { sticker: buffer }, { quoted: mek });
        } else {
            return reply("*ARE AP PHOTO YA VIDEO KO MENTION KARE BAS AUR KISI CHIZ KO NAI OK 😊❤️*");
        }
    }
);

// JawadTechX
