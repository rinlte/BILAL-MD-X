const config = require('../config')
const { cmd, commands } = require('../command')
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, runtime, sleep, fetchJson} = require('../lib/functions')

cmd({
    pattern: "updategname",
    alias: ["upgname", "gname"],
    react: "🌹",
    desc: "Change the group name.",
    category: "group",
    filename: __filename
},           
async (conn, mek, m, { from, isGroup, isAdmins, isBotAdmins, args, q, reply }) => {
    try {
        if (!isGroup) return reply("*YEH COMMAND SIRF GROUPS ME USE KAREIN ☺️❤️*");
        if (!isAdmins) return reply("*YEH COMMAND SIRF GROUP ADMINS USE KAR SAKTE HAI ☺️❤️*");
        if (!isBotAdmins) return reply("*PEHLE MUJHE IS GROUP ME ADMIN BANAO ☺️❤️*");
        if (!q) return reply("*AP NE GROUP KA NAME CHANGE KARNA HAI TO ESE CHANGE KARO ☺️❤️* \n *.GNAME ❮GROUP KA NEW NAME❯* \n *JAB AP ESE LIKHE GE TO GROUP KA NAME CHANGE HO JAYE GA ☺️🌹*");

        await conn.groupUpdateSubject(from, q);
        reply(`*GROUP KA NAME CHANGE HO GAYA HAI ☺️❤️* *${q}*`);
    } catch (e) {
        console.error("*DUBARA KOSHISH KAREIN 🥺❤️*", e);
        reply("*DUBARA KOSHISH KAREIN 🥺❤️*");
    }
});
