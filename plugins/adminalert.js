const { cmd } = require('../command');

let groupAlertState = {}; // group-specific toggle
let adminCache = {}; // store previous admin lists

// 🔹 Toggle command
cmd({
    pattern: "adminalert",
    alias: ["aalert"],
    desc: "Enable or disable admin promote/demote alerts",
    category: "group",
    filename: __filename
}, async (conn, mek, m, { from, args, reply, isGroup, isAdmins }) => {
    if (!isGroup) return reply("*YEH COMMAND SIRF GROUPS ME USE KAREIN ☺️❤️*");
    if (!isAdmins) return reply("*YEH COMMAND SIRF GROUP ADMINS USE KAR SAKTE HAI ☺️❤️*");

    const option = args[0]?.toLowerCase();
    if (!option) {
        const state = groupAlertState[from] ? "✅ ON" : "❌ OFF";
        return reply(`🕹️ *Admin Alert System*\nUse:\n.adminalert on / off\nCurrent: ${state}`);
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

// 🔹 Setup listener (manual + normal detection)
const setupAdminAlerts = (conn) => {
    // Listen to participant updates (for app promote/demote events)
    conn.ev.on("group-participants.update", async (anu) => {
        try {
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
                    await conn.sendMessage(anu.id, { text, mentions: [actor, target] });
                }
            }
        } catch (err) {
            console.log("⚠️ Admin Alert Error:", err);
        }
    });

    // 🔹 Periodic check for manual changes (every 30 sec)
    setInterval(async () => {
        try {
            const groups = Object.keys(groupAlertState).filter(g => groupAlertState[g]);
            for (const groupId of groups) {
                const metadata = await conn.groupMetadata(groupId);
                const currentAdmins = metadata.participants
                    .filter(p => p.admin)
                    .map(p => p.id);

                if (!adminCache[groupId]) {
                    adminCache[groupId] = currentAdmins;
                    continue;
                }

                const oldAdmins = adminCache[groupId];
                const promoted = currentAdmins.filter(id => !oldAdmins.includes(id));
                const demoted = oldAdmins.filter(id => !currentAdmins.includes(id));

                if (promoted.length || demoted.length) {
                    const groupName = metadata.subject || "Group";
                    for (const id of promoted) {
                        await conn.sendMessage(groupId, {
                            text: `*@${id.split('@')[0]} KO IS GROUP (${groupName}) ME ADMIN BANA DIYA GAYA HAI 🥰🌹*`,
                            mentions: [id]
                        });
                    }
                    for (const id of demoted) {
                        await conn.sendMessage(groupId, {
                            text: `*@${id.split('@')[0]} KO IS GROUP (${groupName}) SE ADMIN SE HATA DIYA GAYA HAI 🥺💔*`,
                            mentions: [id]
                        });
                    }
                }

                adminCache[groupId] = currentAdmins;
            }
        } catch (err) {
            console.log("⚠️ Manual Admin Check Error:", err);
        }
    }, 30000); // every 30 seconds
};

module.exports = { setupAdminAlerts };
