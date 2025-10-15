const config = require('../config')
const { cmd } = require('../command')
const { sleep } = require('../lib/functions')

cmd({
    pattern: "join",
    react: "☺️",
    alias: ["joinme", "f_join"],
    desc: "Join a group from invite link or reply/mention",
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

        // Reply/mention handling
        if (quoted) {
            let text = "";

            // 1️⃣ Normal conversation
            if (quoted.message.conversation) text = quoted.message.conversation;
            // 2️⃣ Extended text
            else if (quoted.message.extendedTextMessage && quoted.message.extendedTextMessage.text)
                text = quoted.message.extendedTextMessage.text;
            // 3️⃣ Image caption
            else if (quoted.message.imageMessage && quoted.message.imageMessage.caption)
                text = quoted.message.imageMessage.caption;
            // 4️⃣ Video caption
            else if (quoted.message.videoMessage && quoted.message.videoMessage.caption)
                text = quoted.message.videoMessage.caption;
            // 5️⃣ Document caption
            else if (quoted.message.documentMessage && quoted.message.documentMessage.caption)
                text = quoted.message.documentMessage.caption;

            if (text.includes("https://chat.whatsapp.com/")) {
                const match = text.match(/https:\/\/chat\.whatsapp\.com\/([0-9A-Za-z]+)/);
                if (match) groupLink = match[1];
            }
        } 
        // Direct argument
        else if (q && q.includes("https://chat.whatsapp.com/")) {
            const match = q.match(/https:\/\/chat\.whatsapp\.com\/([0-9A-Za-z]+)/);
            if (match) groupLink = match[1];
        }

        // Invalid link
        if (!groupLink) {
            await conn.sendMessage(from, { react: { text: "😥", key: mek.key } });
            return reply("*YEH WHATSAPP GROUP KA LINK NAHI 🥺*");
        }

        // Join the group
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
