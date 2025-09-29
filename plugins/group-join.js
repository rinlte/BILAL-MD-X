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
}, async (conn, mek, m, { from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isCreator, isDev, isAdmins, reply }) => {
    try {
        const msr = {
            own_cmd: "*AP YE COMMAND USE NAHI KAR SAKTE 🥺❤️*"
        };

        // Only allow the creator to use the command
        if (!isCreator) return reply(msr.own_cmd);

        // If there's no input, check if the message is a reply with a link
        if (!q && !quoted) return reply("*AGAR AP NE KOI GROUP JOIN KARNA HAI TO ESE LIKHO ☺️❤️* \n *.JOIN ❮ GROUP LINK ❯* \n *JAB ESE GROUP KA LINK TYPE KRE GE TO AP GROUP ME JOIN HO JAYE GE ☺️❤️*");

        let groupLink;

        // If the message is a reply to a group invite link
        if (quoted && quoted.type === 'conversation' && isUrl(quoted.text)) {
            groupLink = quoted.text.split('https://chat.whatsapp.com/')[1];
        } else if (q && isUrl(q)) {
            // If the user provided the link in the command
            groupLink = q.split('https://chat.whatsapp.com/')[1];
        }

        if (!groupLink) return reply("*YEH WHATSAPP GROUP KA LINK NAHI 🥺❤️*");

        // Accept the group invite
        await conn.groupAcceptInvite(groupLink);
        await conn.sendMessage(from, { text: `*GROUP ME JOIN HO CHUKE HAI ☺️❤️*` }, { quoted: mek });

    } catch (e) {
        await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
        console.log(e);
        reply(`*DUBARA KOSHISH KAREIN 🥺❤️*\n\n${e}`);
    }
});
