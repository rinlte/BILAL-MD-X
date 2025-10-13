const { cmd } = require("../command");
const { fetchEmix } = require("../lib/emix-utils");
const { getBuffer } = require("../lib/functions");
const { Sticker, StickerTypes } = require("wa-sticker-formatter");

cmd({
    pattern: "emix",
    desc: "Combine two emojis into a sticker.",
    category: "fun",
    react: "😃",
    use: ".emix 😂,🙂",
    filename: __filename,
}, async (conn, mek, m, { args, q, reply }) => {
    try {
        if (!q.includes(",")) {
            return reply("*ESE LIKHO* \n *EMIX 😍,😇*");
        }

        let [emoji1, emoji2] = q.split(",").map(e => e.trim());

        if (!emoji1 || !emoji2) {
            return reply("*DONO EMOJIES K DARMYAN ME COMMA LAGAO 🥺*");
        }

        let imageUrl = await fetchEmix(emoji1, emoji2);

        if (!imageUrl) {
            return reply("*DUBARA KOSHISH KARE 🥺🌹*");
        }

        let buffer = await getBuffer(imageUrl);
        let sticker = new Sticker(buffer, {
            pack: "MADE BY",
            author: "BILAL-MD",
            type: StickerTypes.FULL,
            categories: ["🤩", "🎉"],
            quality: 75,
            background: "transparent",
        });

        const stickerBuffer = await sticker.toBuffer();
        await conn.sendMessage(mek.chat, { sticker: stickerBuffer }, { quoted: mek });

    } catch (e) {
        console.error("*DUBARA KOSHISH KARE 🥺🌹*", e.message);
        reply(`*DUBARA KOSHISH KARE 🥺🌹* ${e.message}`);
    }
});
          
