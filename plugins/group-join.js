const config = require('../config')
const { cmd, commands } = require('../command')
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, runtime, sleep, fetchJson } = require('../lib/functions')

cmd({
    pattern: "join",
    react: "☺️",
    alias: ["joinme", "f_join"],
    desc: "To Join a Group from Invite link",
    category: "group",
    use: '.join < Group Link >',
    filename: __filename
}, async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isCreator, reply }) => {
    try {
        // 1️⃣ Only bot owner can use
        if (!isCreator) {
            await conn.sendMessage(from, { react: { text: "😎", key: mek.key } });
            return reply("*YEH COMMAND SIRF MERE LIE HAI 😎*");
        }

        // 2️⃣ No link provided → show guidance msg
        if (!q && !quoted) {
            await conn.sendMessage(from, { react: { text: "🥺", key: mek.key } });
            return reply("*AGAR AP NE KOI GROUP JOIN KARNA HAI TO ESE LIKHO ☺️❤️*\n*.JOIN ❮ GROUP LINK ❯*\n*JAB ESE GROUP KA LINK TYPE KRE GE TO AP GROUP ME JOIN HO JAYE GE ☺️❤️*");
        }

        let groupLink;

        // 3️⃣ Extract link from reply or argument
        if (quoted && quoted.type === 'conversation' && isUrl(quoted.text)) {
            groupLink = quoted.text.split('https://chat.whatsapp.com/')[1];
        } else if (q && isUrl(q)) {
            groupLink = q.split('https://chat.whatsapp.com/')[1];
        }

        // 4️⃣ Invalid link
        if (!groupLink) {
            await conn.sendMessage(from, { react: { text: "😥", key: mek.key } });
            return reply("*YEH WHATSAPP GROUP KA LINK NAHI 🥺*");
        }

        // 5️⃣ Accept invite
        await conn.groupAcceptInvite(groupLink);
        await conn.sendMessage(from, { react: { text: "🥰", key: mek.key } });
        await conn.sendMessage(from, { text: "*GROUP JOIN HO CHUKE HAI ☺️*" }, { quoted: mek });

    } catch (e) {
        console.log(e);
        await conn.sendMessage(from, { react: { text: "😔", key: mek.key } });
        reply(`*DUBARA KOSHISH KARE 😔*\n\n${e}`);
    }
});
