const config = require('../config')
const { cmd, commands } = require('../command')
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, runtime, sleep, fetchJson} = require('../lib/functions')

cmd({
    pattern: "tagall",
    react: "🔊",
    alias: ["gc_tagall"],
    desc: "To Tag all Members",
    category: "group",
    use: '.tagall [message]',
    filename: __filename
},
async (conn, mek, m, { from, participants, reply, isGroup, senderNumber, groupAdmins, prefix, command, args, body }) => {
    try {
        if (!isGroup) return reply("*YEH COMMAND SIRF GROUPS ME USE KAREIN ☺️❤️*");
        
        const botOwner = conn.user.id.split(":")[0]; // Extract bot owner's number
        const senderJid = senderNumber + "@s.whatsapp.net";

        if (!groupAdmins.includes(senderJid) && senderNumber !== botOwner) {
            return reply("*AP YE COMMAND USE NAHI KAR SAKTE 🥺❤️* \n *YEH COMMAND SIRF MERE LIE HAI ☺️❤️*");
        }

        // Ensure group metadata is fetched properly
        let groupInfo = await conn.groupMetadata(from).catch(() => null);
        if (!groupInfo) return reply("*DUBARA KOSHISH KAREIN 🥺❤️*");

        let groupName = groupInfo.subject || "Unknown Group";
        let totalMembers = participants ? participants.length : 0;
        if (totalMembers === 0) return reply("*DUBARA KOSHISH KAREIN 🥺❤️*");

        let emojis = ['💞', '🌺', '💓', '🦋', '🥰', '❤️', '🌹'];
        let randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];

        // Proper message extraction
        let message = body.slice(body.indexOf(command) + command.length).trim();
        if (!message) message = "👑 ALL MEMBERS LIST 👑*"; // Default message

        let teks = `👑GROUP :❯ *${groupName}*\n👑 MEMBERS :❯ *${totalMembers}*\n👑 MESSAGE :❯ *${message}*\n\n`;

        for (let mem of participants) {
            if (!mem.id) continue; // Prevent undefined errors
            teks += `${randomEmoji} @${mem.id.split('@')[0]}\n`;
        }

        teks += "*👑 BILAL-MD WHATSAPP BOT 👑*";

        conn.sendMessage(from, { text: teks, mentions: participants.map(a => a.id) }, { quoted: mek });

    } catch (e) {
        console.error("*DUBARA KOSHISH KAREIN 🥺❤️*", e);
        reply(`*DUBARA KOSHISH KAREIN 🥺❤️*\n\n${e.message || e}`);
    }
});

