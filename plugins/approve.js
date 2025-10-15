const { cmd } = require('../command');

cmd({
    pattern: "approve",
    alias: ["requests", "approvelist"],
    react: "📋",
    desc: "Show pending join requests and approve manually.",
    category: "group",
    filename: __filename
}, async (conn, mek, m, { from, reply, isGroup, isAdmins, isBotAdmins }) => {
    if (!isGroup) return reply("*YEH COMMAND SIRF GROUPS ME USE KAREIN ☺️❤️*");
    if (!isAdmins) return reply("*YEH COMMAND SIRF GROUP ADMINS USE KAR SAKTE HAI ☺️❤️*");
    if (!isBotAdmins) return reply("*PEHLE MUJHE IS GROUP ME ADMIN BANAO ☺️❤️*");

    try {
        const requests = await conn.groupRequestParticipantsList(from);
        if (!requests || requests.length === 0) {
            return reply("*IS GROUP ME ABHI KOI JOIN REQUEST NAHI HAI 😇🌹*");
        }

        let msg = "📋 *GROUP JOIN REQUEST LIST:*\n\n";
        requests.forEach((user, i) => {
            msg += `${i + 1}. @${user.jid.split('@')[0]}\n`;
        });
        msg += "\n✅ Approve Request → *.approve <number>*\n❌ Delete Request → *.delrequest <number>*";

        await conn.sendMessage(from, { text: msg, mentions: requests.map(u => u.jid) });
    } catch (e) {
        console.log(e);
        reply("*REQUEST LIST NIKALNE ME ERROR AYA 😔*");
    }
});

cmd({
    pattern: "approve",
    dontAddCommandList: true,
    react: "✅",
    desc: "Approve a specific join request",
    category: "group",
    filename: __filename
}, async (conn, mek, m, { from, args, reply, isGroup, isAdmins, isBotAdmins }) => {
    if (!isGroup) return;
    if (!isAdmins) return;
    if (!isBotAdmins) return;

    try {
        const requests = await conn.groupRequestParticipantsList(from);
        if (!requests || requests.length === 0) return reply("*KOI REQUEST NAHI MILI 😔*");

        const index = parseInt(args[0]) - 1;
        if (isNaN(index) || !requests[index]) return reply("*GALAT NUMBER LIKHA HAI 😅*\nUse: *.approve 1*");

        const user = requests[index].jid;
        await conn.groupRequestParticipantsUpdate(from, [user], "approve");
        reply(`✅ *@${user.split('@')[0]}* KO GROUP ME JOIN KARNE KI IJAZAT DE DI GAYI 🌹`);
    } catch (e) {
        console.log(e);
        reply("*APPROVE KARNE ME ERROR AYA 😔*");
    }
});

cmd({
    pattern: "delrequest",
    alias: ["reject", "deny"],
    react: "❌",
    desc: "Delete or reject a join request",
    category: "group",
    filename: __filename
}, async (conn, mek, m, { from, args, reply, isGroup, isAdmins, isBotAdmins }) => {
    if (!isGroup) return;
    if (!isAdmins) return;
    if (!isBotAdmins) return;

    try {
        const requests = await conn.groupRequestParticipantsList(from);
        if (!requests || requests.length === 0) return reply("*KOI REQUEST NAHI MILI 😔*");

        const index = parseInt(args[0]) - 1;
        if (isNaN(index) || !requests[index]) return reply("*GALAT NUMBER LIKHA HAI 😅*\nUse: *.delrequest 1*");

        const user = requests[index].jid;
        await conn.groupRequestParticipantsUpdate(from, [user], "reject");
        reply(`❌ *@${user.split('@')[0]}* KI JOIN REQUEST DELETE KAR DI GAYI 💔`);
    } catch (e) {
        console.log(e);
        reply("*REQUEST DELETE KARNE ME ERROR AYA 😔*");
    }
});
