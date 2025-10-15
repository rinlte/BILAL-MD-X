const { cmd } = require('../command');

let adminAlertEnabled = false;

cmd({
    pattern: "adminalert",
    alias: ["adminalert", "aalert"],
    desc: "Enable or disable admin promote/demote alert system",
    category: "group",
    filename: __filename
}, async (conn, mek, m, { from, args, reply, isGroup, isAdmins }) => {
    try {
        if (!isGroup) return reply("*YEH COMMAND SIRF GROUPS ME USE KAR SAKTE HO ☺️❤️*");
        if (!isAdmins) return reply("*YEH COMMAND SIRF GROUP ADMINS USE KAR SAKTE HAI ☺️❤️*");

        const option = args[0]?.toLowerCase();

        if (!option) {
            return reply(`🕹️ *Admin Alert Toggle*\n\nUse:\n.adminalert on → 🔔 Enable Alerts\n.adminalert off → 🔕 Disable Alerts\n\n*Current:* ${adminAlertEnabled ? "✅ ON" : "❌ OFF"}`);
        }

        if (option === "on") {
            if (adminAlertEnabled) return reply("*ADMIN ALERT PEHLE SE ON HAI 🌹*");
            adminAlertEnabled = true;
            reply("*ADMIN ALERT SYSTEM AB ON HO GAYA HAI 🥰🌹*\n_AB KOI ADMIN KISI KO ADMIN BANAYE YA HATAE TO BOT MSG DEGA 💫_");
        } 
        else if (option === "off") {
            if (!adminAlertEnabled) return reply("*ADMIN ALERT PEHLE SE OFF HAI 🌹*");
            adminAlertEnabled = false;
            reply("*ADMIN ALERT SYSTEM AB OFF KAR DIYA GAYA HAI 🥺💔*");
        } 
        else {
            reply("*GALAT OPTION LIKHA HAI ☹️*\nUse: .adminalert on / off");
        }
    } catch (err) {
        console.log("Toggle Error:", err);
        reply("*KUCH GALAT HUA, DUBARA TRY KARO 🥺*");
    }
});


// 🔹 Real-time listener (mentions version)
const setupAdminAlerts = (conn) => {
    conn.ev.on('group-participants.update', async (anu) => {
        try {
            if (!adminAlertEnabled) return;
            if (!anu.id || !anu.participants || !anu.action) return;

            const metadata = await conn.groupMetadata(anu.id);
            const groupName = metadata.subject;

            const actorJid = anu.author || "";
            const actorTag = `@${actorJid.split('@')[0]}`;

            // 🟢 Promote
            if (anu.action === 'promote') {
                for (let num of anu.participants) {
                    const targetTag = `@${num.split('@')[0]}`;
                    const text = `*${actorTag} NE ${targetTag} KO IS GROUP (${groupName}) ME ADMIN BANA DIYA HAI 🥰🌹*`;
                    await conn.sendMessage(anu.id, {
                        text,
                        mentions: [anu.author, num]
                    });
                }
            }

            // 🔴 Demote
            if (anu.action === 'demote') {
                for (let num of anu.participants) {
                    const targetTag = `@${num.split('@')[0]}`;
                    const text = `*${actorTag} NE ${targetTag} KO IS GROUP (${groupName}) SE ADMIN SE HATA DIYA HAI 🥺💔*`;
                    await conn.sendMessage(anu.id, {
                        text,
                        mentions: [anu.author, num]
                    });
                }
            }

        } catch (err) {
            console.log("Admin Alert Error:", err);
        }
    });
};

module.exports = { setupAdminAlerts };
