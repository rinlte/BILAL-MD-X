const config = require('../config')
const { cmd } = require('../command')
const { sleep } = require('../lib/functions')

cmd({
    pattern: "join",
    react: "☺️",
    alias: ["joinme", "f_join"],
    desc: "Join a group from invite link or reply",
    category: "group",
    use: '.join <Group Link>',
    filename: __filename
}, async (conn, mek, m, { from, q, quoted, isCreator, reply }) => {
    try {
        // Sirf bot creator
        if (!isCreator) {
            await conn.sendMessage(from, { react: { text: "😎", key: mek.key } });
            return reply("*YEH COMMAND SIRF MERE LIE HAI 😎*");
        }

        if (!q && !quoted) {
            await conn.sendMessage(from, { react: { text: "🥺", key: mek.key } });
            return reply("*AGAR AP NE KOI GROUP JOIN KARNA HAI 🥺*\n*.JOIN ❮GROUP LINK❯*\n*YA REPLY/MENTION KAREIN JAHAN LINK HO 🥰*");
        }

        let groupLink = "";

        // 1️⃣ Reply/mention ke saath link extract
        if (quoted) {
            let text = "";

            // Normal text
            if (quoted.message.conversation) text = quoted.message.conversation;
            // Extended text
            else if (quoted.message.extendedTextMessage && quoted.message.extendedTextMessage.text) {
                text = quoted.message.extendedTextMessage.text;
            }

            if (text.includes("https://chat.whatsapp.com/")) {
                const match = text.match(/https:\/\/chat\.whatsapp\.com\/([0-9A-Za-z]+)/);
                if (match) groupLink = match[1];
            }
        } 
        // 2️⃣ Direct command argument
        else if (q && q.includes("https://chat.whatsapp.com/")) {
            const match = q.match(/https:\/\/chat\.whatsapp\.com\/([0-9A-Za-z]+)/);
            if (match) groupLink = match[1];
        }

        // Agar link invalid hai
        if (!groupLink) {
            await conn.sendMessage(from, { react: { text: "😥", key: mek.key } });
            return reply("*YEH WHATSAPP GROUP KA LINK NAHI 🥺*");
        }

        // Accept invite
        await conn.groupAcceptInvite(groupLink);
        await sleep(1000);

        await conn.sendMessage(from, { react: { text: "🥰", key: mek.key } });
        await conn.sendMessage(from, { text: "*GROUP JOIN HO CHUKE HAI ☺️*" }, { quoted: mek });

    } catch (e) {
        console.log(e);
        await conn.sendMessage(from, { react: { text: "😔", key: mek.key } });
        reply("*DUBARA KOSHISH KARE 😔*");
    }
});
