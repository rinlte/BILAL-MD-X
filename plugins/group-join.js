const config = require('../config')
const { cmd } = require('../command')
const { isUrl } = require('../lib/functions')

cmd({
    pattern: "join",
    react: "☺️",
    alias: ["joinme", "f_join"],
    desc: "To Join a Group from Invite link",
    category: "group",
    use: '.join < Group Link >',
    filename: __filename
}, async (conn, mek, m, { from, quoted, body, q, isCreator, reply }) => {
    try {
        // Only bot owner
        if (!isCreator) {
            await conn.sendMessage(from, { react: { text: "😎", key: mek.key } });
            return reply("*YEH COMMAND SIRF MERE LIE HAI 😎*");
        }

        // Agar owner bina link ke command likhe
        if (!q && !quoted) {
            await conn.sendMessage(from, { react: { text: "🥺", key: mek.key } });
            return reply("*AGAR AP NE KOI GROUP JOIN KARNA HAI TO ESE LIKHO ☺️❤️*\n*.JOIN ❮ GROUP LINK ❯*\n*JAB ESE GROUP KA LINK TYPE KRE GE TO AP GROUP ME JOIN HO JAYE GE ☺️❤️*");
        }

        let groupLink;

        // Agar reply me link hai
        if (quoted && quoted.text && isUrl(quoted.text)) {
            groupLink = quoted.text.split('https://chat.whatsapp.com/')[1];
        } else if (q && isUrl(q)) {
            groupLink = q.split('https://chat.whatsapp.com/')[1];
        }

        // Agar link invalid hai
        if (!groupLink) {
            await conn.sendMessage(from, { react: { text: "☺️", key: mek.key } });
            return reply("*AGAR AP NE KOI GROUP JOIN KARNA HAI TO ESE LIKHO ☺️❤️*\n*.JOIN ❮ GROUP LINK ❯*\n*JAB ESE GROUP KA LINK TYPE KRE GE TO AP GROUP ME JOIN HO JAYE GE ☺️❤️*");
        }

        // Accept invite
        await conn.groupAcceptInvite(groupLink);
        await conn.sendMessage(from, { react: { text: "🥰", key: mek.key } });
        await conn.sendMessage(from, { text: "*GROUP JOIN HO CHUKE HAI ☺️*" }, { quoted: mek });

    } catch (e) {
        console.log(e);
        await conn.sendMessage(from, { react: { text: "😔", key: mek.key } });
        reply("*DUBARA KOSHISH KARE 😔*");
    }
});
