const config = require('../config');
const { cmd, commands } = require('../command');

const { sleep } = require('../lib/functions');

cmd({
    pattern: "menu",
    alias: ["m", "me", "men", "meno", "menu1", "menus", "list", "li", "lis", "lists", "allcmd", "allcmds", "totalcmds", "cmd", "cmds", "show", "showcmd"],
    desc: "Show interactive menu system line by line",
    category: "menu",
    react: "👑",
    filename: __filename
}, async (conn, mek, m, { from, reply }) => {
    try {
        const menuText = `*╭━━━〔 👑 BiLAL-MD 👑 〕━━━┈⊷*
*┃👑╭──────────────*
*┃👑│ USER:❯ ${config.OWNER_NAME}*
*┃👑│ USER:❯ ${config.OWNER_NUMBER}*
*┃👑│ MODE :❯ ${config.MODE}*
*┃👑│ PREFiX :❯ ${config.PREFIX}*
*┃👑│ COMMANDS :❯ ${commands.length}*
*┃👑╰──────────────*
*╰━━━━━━━━━━━━━━━┈⊷*

*HI ${m.pushName || 'User'} G 🥰*
*MERE BOT KA MENU ☺️*
*YEH HAI G 🌹*

*╭━━〔 👑 DOWNLOAD 👑 〕━━┈⊷*
*┃👑│ • FB*
*┃👑│ • TIKTOK*
*┃👑│ • APK*
*┃👑│ • IMG*
*┃👑│ • SONG*
*┃👑│ • VIDEO*
*╰━━━━━━━━━━━━━━━┈⊷*

*╭━━〔 👑 GROUP 👑 〕━━┈⊷*
*┃👑│ • INVITE*
*┃👑│ • ADD*
*┃👑│ • KICK*
*┃👑│ • PROMOTE*
*┃👑│ • DEMOTE*
*┃👑│ • DISMISS*
*┃👑│ • MUTE*
*┃👑│ • UNMUTE*
*┃👑│ • LOCKGC*
*┃👑│ • UNLOCKGC*
*┃👑│ • TAGALL*
*┃👑│ • HTAG*
*┃👑│ • PENDING*
*┃👑│ • ACCEPTALL*
*┃👑│ • REJECTALL*
*┃👑│ • GDESC*
*┃👑│ • GNAME*
*╰━━━━━━━━━━━━━━━┈⊷*

*╭━━〔 👑 USER 👑 〕━━┈⊷*
*┃👑│ • BLOCK*
*┃👑│ • UNBLOCK*
*┃👑│ • GETPP*
*┃👑│ • RESTART*
*┃👑│ • UPDATE*
*┃👑│ • AUTOBIO*
*╰━━━━━━━━━━━━━━━┈⊷*

*╭━━〔 👑 AI 👑 〕━━┈⊷*
*┃👑│ • AI*
*┃👑│ • GPT*
*╰━━━━━━━━━━━━━━━┈⊷*

*👑 BILAL-MD WHATSAPP BOT 👑*`;

        // Split menu by lines
        const lines = menuText.split("\n");

        // Send initial empty message
        let currentText = "";
        const msg = await conn.sendMessage(from, { text: currentText }, { quoted: mek });

        // Add lines one by one every 1 second
        for (const line of lines) {
            currentText += line + "\n";
            await sleep(1000); // 1 second delay
            await conn.relayMessage(from, {
                protocolMessage: {
                    key: msg.key,
                    type: 14,
                    editedMessage: { conversation: currentText }
                }
            }, {});
        }

    } catch (e) {
        console.error('Menu Error:', e);
        reply(`❌ Menu error: ${e.message}`);
    }
});
