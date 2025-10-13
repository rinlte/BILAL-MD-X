const config = require('../config');
const { cmd, commands } = require('../command');
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, runtime, sleep, fetchJson } = require('../lib/functions');

cmd({
    pattern: "updategdesc",
    alias: ["upgdesc", "gdesc", "gcdesc", "gdescr", "updategdesc", "changegdesc", "gdescrypt", "gdescri"],
    react: "🌹",
    desc: "Change the group description.",
    category: "group",
    filename: __filename
},           
async (conn, mek, m, { from, isGroup, isAdmins, isBotAdmins, args, q, reply }) => {
    try {
        // React based on conditions
        if (!isGroup) {
            await conn.sendMessage(from, { react: { text: "😫", key: m.key } });
            return reply("*YEH COMMAND SIRF GROUPS ME USE KAREIN ☺️❤️*");
        }
        if (!isAdmins) {
            await conn.sendMessage(from, { react: { text: "🤐", key: m.key } });
            return reply("*YEH COMMAND SIRF GROUP ADMINS USE KAR SAKTE HAI ☺️❤️*");
        }
        if (!isBotAdmins) {
            await conn.sendMessage(from, { react: { text: "😎", key: m.key } });
            return reply("*PEHLE MUJHE IS GROUP ME ADMIN BANAO ☺️❤️*");
        }
        if (!q) return reply("*AP NE GROUP KI DESCRIPTION CHANGE KARNI HAI TO ESE CHANGE KARO ☺️❤️* \n *.GDESC ❮ APKA MSG❯* \n *JAB AP ESE LIKHE GE TO GROUP KI DESCRIPTION CHANGE HO JAYE GE ☺️🌹*");

        // Update group description
        await conn.groupUpdateDescription(from, q);

        // Reply with updated message
        const updatedMsg = `*IS GROUP KI DESCRIPTION ME YEH MSG ADD HO CHUKA HAI*\n\n${q}`;
        await reply(updatedMsg);

        // React command message ☺️ after successful update
        await conn.sendMessage(from, { react: { text: "☺️", key: m.key } });

    } catch (e) {
        console.error("*DUBARA KOSHISH KAREIN 🥺❤️*", e);
        reply("*DUBARA KOSHISH KAREIN 🥺❤️*");
    }
});
