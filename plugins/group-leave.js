const { sleep } = require('../lib/functions');
const config = require('../config')
const { cmd, commands } = require('../command')


// JawadTechX

cmd({
    pattern: "leave",
    alias: ["left", "leftgc", "leavegc"],
    desc: "Leave the group",
    react: "🥺",
    category: "owner",
    filename: __filename
},
async (conn, mek, m, {
    from, quoted, body, isCmd, command, args, q, isGroup, senderNumber, reply
}) => {
    try {

        if (!isGroup) {
            return reply("*YEH COMMAND SIRF GROUPS ME USE KAREIN ☺️❤️*");
        }
        

        const botOwner = conn.user.id.split(":")[0]; 
        if (senderNumber !== botOwner) {
            return reply("*AP YE COMMAND USE NAHI KAR SAKTE 🥺❤️* \n *YEH COMMAND SIRF MERE LIE HAI ☺️❤️*");
        }

        reply("Leaving group...");
        await sleep(1500);
        await conn.groupLeave(from);
        reply("*ALLAH HAFIZ ALL 🥺❤️*");
    } catch (e) {
        console.error(e);
        reply(`*DUBARA KOSHISH KAREIN 🥺❤️* ${e}`);
    }
});

