const { cmd } = require('../command');

// Command to list all pending group join requests
cmd({
    pattern: "requestlist",
    desc: "Shows pending group join requests",
    category: "group",
    react: "☺️",
    filename: __filename
},
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        await conn.sendMessage(from, {
            react: { text: '🤔', key: m.key }
        });

        if (!isGroup) {
            await conn.sendMessage(from, {
                react: { text: '🥺', key: m.key }
            });
            return reply("*AP YEH COMMAND GROUP ME USE KARO ☺️❤️*");
        }
        if (!isAdmins) {
            await conn.sendMessage(from, {
                react: { text: '🥺', key: m.key }
            });
            return reply("*YEH COMMAND SIRF GRKOUP KE ADMINS USE KAR SAKTE HAI ☺️❤️*");
        }
        if (!isBotAdmins) {
            await conn.sendMessage(from, {
                react: { text: '🥺', key: m.key }
            });
            return reply("*GROUP ME LOG JOIN HONA CHAHTE HAI ☺️* \n *AP MUJHE ADMIN BANAYE GE TO ME IN SAB KI REQUESS ACCEPT KARO 🥺❤️*");
        }

        const requests = await conn.groupRequestParticipantsList(from);
        
        if (requests.length === 0) {
            await conn.sendMessage(from, {
                react: { text: '🙂', key: m.key }
            });
            return reply("*KOI BHI NEW MEMBER KI REQUEST ABHI NAHI AYI ☺️❤️*");
        }

        let text = `*YEH SAB LOG GROUP ME JOIN HONA CHAHTE HAI 🥺* \n (${requests.length})*\n\n`;
        requests.forEach((user, i) => {
            text += `${i+1}. @${user.jid.split('@')[0]}\n`;
        });

        await conn.sendMessage(from, {
            react: { text: '😃', key: m.key }
        });
        return reply(text, { mentions: requests.map(u => u.jid) });
    } catch (error) {
        console.error("Request list error:", error);
        await conn.sendMessage(from, {
            react: { text: '🥺', key: m.key }
        });
        return reply("*DUBARA KOSHISH KAREIN ☺️❤️*");
    }
});

// Command to accept all pending join requests
cmd({
    pattern: "acceptall",
    desc: "Accepts all pending group join requests",
    category: "group",
    react: "☺️",
    filename: __filename
},
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        await conn.sendMessage(from, {
            react: { text: '🤔', key: m.key }
        });

        if (!isGroup) {
            await conn.sendMessage(from, {
                react: { text: '🥺', key: m.key }
            });
            return reply("*YEH COMMAND SIRF GROUPS ME USE KAREIN ☺️❤️*");
        }
        if (!isAdmins) {
            await conn.sendMessage(from, {
                react: { text: '🥺', key: m.key }
            });
            return reply("*YEH COMMAND SIRF GROUP ADMINS USE KAR SAKTE HAI ☺️❤️*");
        }
        if (!isBotAdmins) {
            await conn.sendMessage(from, {
                react: { text: '🥺', key: m.key }
            });
            return reply("*PEHLE MUJHE IS GROUP ME ADMIN BANAO ☺️❤️*");
        }

        const requests = await conn.groupRequestParticipantsList(from);
        
        if (requests.length === 0) {
            await conn.sendMessage(from, {
                react: { text: '😃', key: m.key }
            });
            return reply("*KOI BHI REQUEST NAHI HAI ACCEPT KARNE K LIE ☺️❤️*");
        }

        const jids = requests.map(u => u.jid);
        await conn.groupRequestParticipantsUpdate(from, jids, "approve");
        
        await conn.sendMessage(from, {
            react: { text: '🌹', key: m.key }
        });
        return reply(`*ITNE ${requests.length} MEMBERS IS GROUP ME JOIN HO CHUKE HAI ☺️❤️*`);
    } catch (error) {
        console.error("Accept all error:", error);
        await conn.sendMessage(from, {
            react: { text: '🥺', key: m.key }
        });
        return reply("*DUBARA KOSHISH KAREIN 🥺❤️*");
    }
});

// Command to reject all pending join requests
cmd({
    pattern: "rejectall",
    desc: "Rejects all pending group join requests",
    category: "group",
    react: "🥺",
    filename: __filename
},
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        await conn.sendMessage(from, {
            react: { text: '🤔', key: m.key }
        });

        if (!isGroup) {
            await conn.sendMessage(from, {
                react: { text: '🥺', key: m.key }
            });
            return reply("*YEH COMMAND SIRF GROUPS ME USE KAREIN ☺️❤️*");
        }
        if (!isAdmins) {
            await conn.sendMessage(from, {
                react: { text: '🥺', key: m.key }
            });
            return reply("*YEH COMMAND SIRF GROUP ADMINS USE KAR SAKTE HAI ☺️❤️*");
        }
        if (!isBotAdmins) {
            await conn.sendMessage(from, {
                react: { text: '🥺', key: m.key }
            });
            return reply("*PEHLE MUJHE IS GROUP ME ADMIN BANAO ☺️❤️*");
        }

        const requests = await conn.groupRequestParticipantsList(from);
        
        if (requests.length === 0) {
            await conn.sendMessage(from, {
                react: { text: '🥺', key: m.key }
            });
            return reply("*KOI BHI REQUEST NAHI HAI ☺️❤️*");
        }

        const jids = requests.map(u => u.jid);
        await conn.groupRequestParticipantsUpdate(from, jids, "reject");
        
        await conn.sendMessage(from, {
            react: { text: '🥺', key: m.key }
        });
        return reply(`IN ${requests.length} SAB MEMBERS KI REQUESTS REJECT HO CHUKI HAI 🥺❤️*`);
    } catch (error) {
        console.error("Reject all error:", error);
        await conn.sendMessage(from, {
            react: { text: '🥺', key: m.key }
        });
        return reply("*DUBARA KOSHISH KAREIN 🥺❤️*");
    }
});
