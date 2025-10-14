const config = require('../config')
const { cmd, commands } = require('../command')
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, runtime, sleep, fetchJson} = require('../lib/functions')

cmd({
    pattern: "tagall",
    react: "🥺",
    alias: ["gc_tagall"],
    desc: "To Tag all Members",
    category: "group",
    use: '.tagall [message]',
    filename: __filename
},
async (conn, mek, m, { from, participants, reply, isGroup, senderNumber, groupAdmins, prefix, command, args, body }) => {
    try {
        // 🥺 React har msg pe
        await conn.sendMessage(from, { react: { text: "🥺", key: m.key } });

        if (!isGroup) {
            await conn.sendMessage(from, { react: { text: "😫", key: m.key } });
            return reply("*YEH COMMAND SIRF GROUPS ME USE KAREIN ☺️❤️*");
        }
        
        const botOwner = conn.user.id.split(":")[0]; 
        const senderJid = senderNumber + "@s.whatsapp.net";

        if (!groupAdmins.includes(senderJid) && senderNumber !== botOwner) {
            await conn.sendMessage(from, { react: { text: "😥", key: m.key } });
            return reply("*YEH COMMAND SIRF MERE LIE HAI ☺️*");
        }

        let groupInfo = await conn.groupMetadata(from).catch(() => null);
        if (!groupInfo) {
            await conn.sendMessage(from, { react: { text: "😔", key: m.key } });
            return reply("*DUBARA KOSHISH KAREIN 🥺❤️*");
        }

        let groupName = groupInfo.subject || "Unknown Group";
        let totalMembers = participants ? participants.length : 0;
        if (totalMembers === 0) {
            await conn.sendMessage(from, { react: { text: "😔", key: m.key } });
            return reply("*DUBARA KOSHISH KAREIN 🥺❤️*");
        }

        let emojis = ['💞', '😍', '💓', '🦋', '🥰', '❤️', '🌹'];
        let randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];

        let message = body.slice(body.indexOf(command) + command.length).trim();
        if (!message) message = "👑 ALL MEMBERS LIST 👑*"; 

        let teks = `*ASSALAMUALAIKUM....🥰* \n *KESE HAI AP SAB ☺️🌹*\n\n`;

        for (let mem of participants) {
            if (!mem.id) continue;
            teks += `${randomEmoji} @${mem.id.split('@')[0]}\n`;
        }

        teks += "*👑 BILAL-MD WHATSAPP BOT 👑*";

        // ☺️ React jab message successfully send ho
        await conn.sendMessage(from, { react: { text: "☺️", key: m.key } });
        conn.sendMessage(from, { text: teks, mentions: participants.map(a => a.id) }, { quoted: mek });

    } catch (e) {
        console.error("*DUBARA KOSHISH KAREIN 🥺❤️*", e);
        await conn.sendMessage(from, { react: { text: "😔", key: m.key } });
        reply(`*DUBARA KOSHISH KAREIN 🥺❤️*\n\n${e.message || e}`);
    }
});
