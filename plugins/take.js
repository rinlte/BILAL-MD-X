const { cmd } = require('../command');
const crypto = require('crypto');
const webp = require('node-webpmux');
const axios = require('axios');
const fs = require('fs-extra');
const { exec } = require('child_process');
const { Sticker, createSticker, StickerTypes } = require("wa-sticker-formatter");
const Config = require('../config');

// Take Sticker 

cmd(
    {
        pattern: 'take',
        alias: ['rename', 'stake'],
        desc: '*AP KISI BHI STICKER KO MENTION KARO AUR PHIR LIKHO \n *take APNA NAME LIKHO* \n *JAB ESE KARO GE TO US STICKER KA NAME APKE NAME K SATH CHANGE HO JAYE GA AUR WO STICKER APKE NAME KA BAN JAYE GA 😊🌹**',
        category: 'sticker',
        use: '<reply media or URL>',
        filename: __filename,
    },
    async (conn, mek, m, { quoted, args, q, reply, from }) => {
        if (!mek.quoted) return reply(`*PEHLE KISI STICKER KO MENTION KARO 😊🌹*`);
        if (!q) return reply(`*DUBARA KOSHISH KARO AUR 😊❤️* \n *.TAKE MADE BY APKA NAME* \n *JAB ESE LIKHO GE TO WO STICKER APKA NAME KA BAN JAYE GA ☺️*`);

        let mime = mek.quoted.mtype;
        let pack = q;

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
            return reply("*FIR KOSHISH KARO 🥺❤️*");
        }
    }
);

//Sticker create 
