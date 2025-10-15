const { cmd } = require('../command');

cmd({
    pattern: "approveall",
    alias: ["acceptall", "approve_all"],
    react: "✅",
    desc: "Approve all pending join requests in the group.",
    category: "group",
    filename: __filename
}, async (conn, mek, m, { from, reply, isGroup, isAdmins, isBotAdmins }) => {
    try {
        if (!isGroup) return reply("*YEH COMMAND SIRF GROUPS ME USE KAREIN ☺️❤️*");
        if (!isAdmins) return reply("*YEH COMMAND SIRF GROUP ADMINS USE KAR SAKTE HAI ☺️❤️*");
        if (!isBotAdmins) return reply("*PEHLE MUJHE IS GROUP ME ADMIN BANAO ☺️❤️*");

        // 🔹 Fetch pending requests
        const requests = await conn.groupRequestParticipantsList(from);
        if (!requests || requests.length === 0) {
            return reply("*IS GROUP ME ABHI KOI JOIN REQUEST NAHI HAI 😇🌹*");
        }

        // 🔹 Approve all requests
        const allUsers = requests.map(u => u.jid);
        await conn.groupRequestParticipantsUpdate(from, allUsers, "approve");

        // 🔹 Send confirmation message
        const msg = `✅ *SAB JOIN REQUESTS APPROVE KAR DI GAYI HAIN!* 🌹\n\nApproved Members:\n${allUsers.map(u => `@${u.split('@')[0]}`).join('\n')}`;
        await conn.sendMessage(from, { text: msg, mentions: allUsers });

    } catch (e) {
        console.error(e);
        reply("*APPROVE ALL KARNE ME ERROR AYA 😔*");
    }
});
