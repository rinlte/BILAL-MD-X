const { cmd } = require("../command");
const { fetchEmix } = require("../lib/emix-utils");
const { getBuffer } = require("../lib/functions");
const { Sticker, StickerTypes } = require("wa-sticker-formatter");

cmd({
    pattern: "emix",
    desc: "Combine two emojis into a sticker.",
    category: "fun",
    react: "🥺",
    use: ".emix 😍😇 or .emix 😍,😇",
    filename: __filename,
}, async (conn, mek, m, { q, reply }) => {
    let waitMsg; // reference to waiting message
    try {
        // React command msg 🥺
        await conn.sendMessage(mek.chat, { react: { text: "🥺", key: mek.key } });

        // Agar sirf .emix likha ho
        if (!q) return reply("*ESE LIKHO* \n *EMIX 😍,😇*");

        let emoji1, emoji2;

        if (q.includes(",")) {
            // Agar comma se diya ho
            [emoji1, emoji2] = q.split(",").map(e => e.trim());
        } else if (q.length >= 2) {
            // Agar direct dono emojis diye ho bina comma
            [emoji1, emoji2] = Array.from(q);
        }

        if (!emoji1 || !emoji2) return reply("*DONO EMOJIES K DARMYAN COMMA YA DONO EMOJIES BANAO 🥺*");

        // Waiting message
        waitMsg = await conn.sendMessage(mek.chat, { text: `*EMOJIE MIX STICKER BAN RAHA HAI....☺️*` });

        let imageUrl = await fetchEmix(emoji1, emoji2);
        if (!imageUrl) {
            if (waitMsg) await conn.sendMessage(mek.chat, { delete: waitMsg.key });
            await conn.sendMessage(mek.chat, { react: { text: "😔", key: mek.key } });
            return reply("*DUBARA KOSHISH KARE 🥺🌹*");
        }

        let buffer = await getBuffer(imageUrl);
        let sticker = new Sticker(buffer, {
            pack: "BILAL-MD",
            author: "WHATSAPP BOT",
            type: StickerTypes.FULL,
            categories: ["🤩", "🎉"],
            quality: 75,
            background: "transparent",
        });

        const stickerBuffer = await sticker.toBuffer();
        await conn.sendMessage(mek.chat, { sticker: stickerBuffer }, { quoted: mek });

        // Delete waiting msg
        if (waitMsg) await conn.sendMessage(mek.chat, { delete: waitMsg.key });

        // React sticker sent msg ☺️
        await conn.sendMessage(mek.chat, { react: { text: "☺️", key: mek.key } });

    } catch (e) {
        console.error("*DUBARA KOSHISH KARE 🥺🌹*", e.message);
        if (waitMsg) await conn.sendMessage(mek.chat, { delete: waitMsg.key });
        await conn.sendMessage(mek.chat, { react: { text: "😔", key: mek.key } });
        reply(`*DUBARA KOSHISH KARE 🥺🌹* ${e.message}`);
    }
});
