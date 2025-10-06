const config = require('../config');
const { cmd, commands } = require('../command');

cmd({
    pattern: "menu",
    alias: ["m", "men", "meno", "mno", "mnos", "cmd", "cmds", "command", "commands", "cmnds"],
    desc: "Show interactive menu system",
    category: "menu",
    react: "👑",
    filename: __filename
}, async (conn, mek, m, { from }) => {
    try {
        const menuCaption = `*╭━━━〔 👑 BiLAL-MD 👑 〕━━━┈⊷*
*┃👑╭──────────────*
*┃👑│ USER:❯* ${config.OWNER_NAME}
*┃👑│ USER:❯* ${config.OWNER_NUMBER}
*┃👑│ PLATFORM :❯* LiNUX
*┃👑│ MODE :❯* ${config.MODE}
*┃👑│ PREFiX :❯* ${config.PREFIX}
*┃👑╰──────────────*
*╰━━━━━━━━━━━━━━━┈⊷*

*╭━━〔 👑 DOWNLOAD 👑 〕━━┈⊷*
*┃👑│ • FB*
*┃👑│ • TIKTOK*
*┃👑│ • INSTA*
*┃👑│ • APK*
*┃👑│ • IMG*
*┃👑│ • SONG*
*┃👑│ • PLAY*
*┃👑│ • VIDEO*
*╰━━━━━━━━━━━━━━━┈⊷*

*╭━━〔 👑 GROUP 👑 〕━━┈⊷*
*┃👑│ • INVITE*
*┃👑│ • ADD*
*┃👑│ • KICK*
*┃👑│ • PROMOTE*
*┃👑│ • DEMOTE*
*┃👑│ • DISMISS*
*┃👑│ • REVOKE*
*┃👑│ • MUTE*
*┃👑│ • UNMUTE*
*┃👑│ • LOCKGC*
*┃👑│ • UNLOCKGC*
*┃👑│ • TAG*
*┃👑│ • HIDETAG*
*┃👑│ • TAGALL*
*┃👑│ • TAGADMINS*
*╰━━━━━━━━━━━━━━━┈⊷*

*╭━━〔 👑 USER 👑 〕━━┈⊷*
*┃👑│ • BLOCK*
*┃👑│ • UNBLOCK*
*┃👑│ • FULLPP*
*┃👑│ • SETPP*
*┃👑│ • GETPP*
*┃👑│ • RESTART*
*┃👑│ • UPDATECMD*
*┃👑│ • OWNERREACT*
*╰━━━━━━━━━━━━━━━┈⊷*

*╭━━〔 👑 AI 👑 〕━━┈⊷*
*┃👑│ • AI*
*┃👑│ • GPT*
*┃👑│ • BING*
*┃👑│ • IMAGINE*
*╰━━━━━━━━━━━━━━━┈⊷*

*╭━━〔 👑 LOGO 👑 〕━━┈⊷*
*┃👑│ • LOGO1*
*┃👑│ • LOGO2*
*┃👑│ • LOGO3*
*┃👑│ • LOGO4*
*┃👑│ • LOGO5*
*┃👑│ • LOGO6*
*┃👑│ • LOGO7*
*┃👑│ • LOGO8*
*┃👑│ • LOGO9*
*┃👑│ • LOGO10*
*┃👑│ • LOGO11*
*┃👑│ • LOGO12*
*┃👑│ • LOGO13*
*┃👑│ • LOGO14*
*┃👑│ • LOGO15*
*┃👑│ • LOGO16*
*┃👑│ • LOGO17*
*┃👑│ • LOGO18*
*┃👑│ • LOGO19*
*┃👑│ • LOGO20*
*╰━━━━━━━━━━━━━━━┈⊷*

*╭━━〔 👑 CONVERTER 👑 〕━━┈⊷*
*┃👑│ • STICKER*
*┃👑│ • EMOJIMIX*
*┃👑│ • TAKE*
*┃👑│ • TOMP3*
*┃👑│ • FANCY*
*┃👑│ • TRT*
*╰━━━━━━━━━━━━━━━┈⊷*

*╭━━〔 👑 XTRA 👑 〕━━┈⊷*
*┃👑│ • TIMENOW*
*┃👑│ • SS*
*┃👑│ • READMORE*
*╰━━━━━━━━━━━━━━━┈⊷*

*╭━━〔 👑 MAIN 👑 〕━━┈⊷*
*┃👑│ • PING*
*┃👑│ • ALIVE*
*┃👑│ • UPTIME*
*┃👑│ • REPO*
*┃👑│ • OWNER*
*┃👑│ • MENU*
*┃👑│ • RESTART*
*╰━━━━━━━━━━━━━━━┈⊷*

*👑 BILAL-MD WHATSAPP BOT 👑*`;

        await conn.sendMessage(
            from,
            {
                image: { url: config.MENU_IMAGE_URL || 'https://files.catbox.moe/kunzpz.png' },
                caption: menuCaption,
                contextInfo: {
                    externalAdReply: {
                        title: "👑 BILAL-MD OFFICIAL CHANNEL 👑",
                        body: "Click below to View Channel",
                        mediaType: 1,
                        thumbnailUrl: config.MENU_IMAGE_URL || 'https://files.catbox.moe/kunzpz.png',
                        sourceUrl: "https://whatsapp.com/channel/0029Vaj3Xnu17EmtDxTNnQ0G",
                        renderLargerThumbnail: true,
                        showAdAttribution: true
                    }
                }
            },
            { quoted: mek }
        );

    } catch (e) {
        console.error('Menu Error:', e);
        await conn.sendMessage(
            from,
            { text: "*DUBARA KOSHISH KARO 🥺❤️*" },
            { quoted: mek }
        );
    }
});
