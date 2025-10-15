const { cmd } = require('../command');

let groupAlertState = {}; // 🔹 har group ka toggle status yahan save hoga

// 🔹 Command to toggle ON/OFF per group
cmd({
    pattern: "adminalert",
    alias: ["aalert"],
    desc: "Enable or disable admin promote/demote alert system per group",
    category: "group",
    filename: __filename
}, async (conn, mek, m, { from, args, reply, isGroup, isAdmins }) => {
    if (!isGroup) return reply("*YEH COMMAND SIRF GROUPS ME USE KAREIN ☺️❤️*");
    if (!isAdmins) return reply("*YEH COMMAND SIRF GROUP ADMINS USE KAR SAKTE HAI ☺️❤️*");

    const option = args[0]?.toLowerCase();

    if (!option) {
        const state = groupAlertState[from] ? "✅ ON" : "❌ OFF";
        return reply(`🕹️ *Admin Alert System*\n\nUse:\n.adminalert on → 🔔 Enable\n.adminalert off → 🔕 Disable\n\n*Current:* ${state}`);
    }

    if (option === "on") {
        groupAlertState[from] = true;
        return reply("*✅ ADMIN ALERT SYSTEM AB IS GROUP ME ON HO GAYA HAI 🥰🌹*");
    }

    if (option === "off") {
        groupAlertState[from] = false;
        return reply("*❌ ADMIN ALERT SYSTEM AB IS GROUP ME OFF KAR DIYA GAYA HAI 🥺💔*");
    }

    reply("*GALAT OPTION LIKHA HAI ☹️*\nUse: .adminalert on / off");
});

// 🔹 Real-time listener for promote/demote (auto detect)
const setupAdminAlerts = (conn) => {
    conn.ev.on("group-participants.update", async (anu) => {
        try {
            // agar group me feature off hai to return
            if (!groupAlertState[anu.id]) return;
            if (!anu.action || !anu.participants) return;

            const groupMetadata = await conn.groupMetadata(anu.id);
            const groupName = groupMetadata.subject || "Group";

            const actor = anu.author || "unknown@s.whatsapp.net";
            const actorMention = `@${actor.split('@')[0]}`;

            for (let target of anu.participants) {
                const targetMention = `@${target.split('@')[0]}`;

                let text = "";
                if (anu.action === "promote") {
                    text = `*${actorMention} NE ${targetMention} KO IS GROUP (${groupName}) ME ADMIN BANA DIYA HAI 🥰🌹*`;
                } else if (anu.action === "demote") {
                    text = `*${actorMention} NE ${targetMention} KO IS GROUP (${groupName}) SE ADMIN SE HATA DIYA HAI 🥺💔*`;
                }

                if (text) {
                    await conn.sendMessage(anu.id, {
                        text,
                        mentions: [actor, target] // ✅ real WhatsApp mentions
                    });
                }
            }

        } catch (err) {
            console.log("⚠️ Admin Alert Error:", err);
        }
    });
};

module.exports = { setupAdminAlerts };
