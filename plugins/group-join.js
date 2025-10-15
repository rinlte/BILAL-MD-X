const config = require('../config')
const { cmd, commands } = require('../command')
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, runtime, sleep, fetchJson } = require('../lib/functions')

cmd({
    pattern: "join",
    react: "😎",
    alias: ["joinme", "f_join"],
    desc: "To Join a Group from Invite link",
    category: "group",
    use: '.join < Group Link >',
    filename: __filename
}, async (conn, mek, m, { from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isCreator, isDev, isAdmins, reply }) => {
    try {
        const msr = {
            own_cmd: "*YEH COMMAND SIRF MERE LIE HAI 😎*"
        };

        // 1️⃣ Owner check
        if (!isCreator) {
            await conn.sendMessage(from, { react: { text: "😎", key: mek.key } });
            return reply(msr.own_cmd);
        }

        // 2️⃣ Check if input/link exists
        if (!q && !quoted) {
            await conn.sendMessage(from, { react: { text: "🥺", key: mek.key } });
            return reply("*AGAR AP NE KOI GROUP JOIN KARNA HAI TO ESE LIKHO ☺️❤️* \n *.JOIN ❮ GROUP LINK ❯* \n *JAB ESE GROUP KA LINK TYPE KRE GE TO AP GROUP ME JOIN HO JAYE GE ☺️❤️*");
        }

        let groupLink;

        // 3️⃣ If message is reply with link
        if (quoted && quoted.type === 'conversation' && isUrl(quoted.text)) {
            groupLink = quoted.text.split('https://chat.whatsapp.com/')[1];
        } else if (q && isUrl(q)) {
            groupLink = q.split('https://chat.whatsapp.com/')[1];
        }

        if (!groupLink) {
            await conn.sendMessage(from, { react: { text: "😥", key: mek.key } });
            return reply("*YEH WHATSAPP GROUP KA LINK NAHI 🥺*");
        }

        // 4️⃣ Accept the invite
        await conn.groupAcceptInvite(groupLink);
        await conn.sendMessage(from, { react: { text: "🥰", key: mek.key } });
        await conn.sendMessage(from, { text: "*GROUP JOIN HO GAYA HAI ☺️*" }, { quoted: mek });

    } catch (e) {
        console.log(e);
        await conn.sendMessage(from, { react: { text: "😔", key: mek.key } });
        reply(`*DUBARA KOSHISH KAREIN 😔*\n\n${e}`);
    }
});
