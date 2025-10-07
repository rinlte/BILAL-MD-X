const config = require('../config');
const { cmd, commands } = require('../command');
const { runtime } = require('../lib/functions');
const axios = require('axios');

cmd({
    pattern: "menu",
    desc: "Show interactive menu system",
    category: "menu",
    react: "👑",
    filename: __filename
}, async (conn, mek, m, { from, reply }) => {
    try {
        const menuCaption = `*╭━━━〔 👑 BiLAL-MD 👑 〕━━━┈⊷*
*┃👑╭──────────────*
*┃👑│ USER:❯ ${config.OWNER_NAME}*
*┃👑│ USER:❯ ${config.OWNER_NUMBER}*
*┃👑│ MODE :❯ ${config.MODE}*
*┃👑│ PREFiX :❯ ${config.PREFIX}*
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

        const contextInfo = {
            mentionedJid: [m.sender],
            forwardingScore: 999,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterJid: '120363296818107681@newsletter',
                newsletterName: config.OWNER_NAME,
                serverMessageId: 143
            }
        };

        // Function to send menu image with timeout
        const sendMenuImage = async () => {
            try {
                return await conn.sendMessage(
                    from,
                    {
                        image: { url: config.MENU_IMAGE_URL || 'https://files.catbox.moe/kunzpz.png' },
                        caption: menuCaption,
                        contextInfo: contextInfo
                    },
                    { quoted: mek }
                );
            } catch (e) {
                console.log('Image send failed, falling back to text');
                return await conn.sendMessage(
                    from,
                    { text: menuCaption, contextInfo: contextInfo },
                    { quoted: mek }
                );
            }
        };

        // send image only (voice removed)
        let sentMsg;
        try {
            sentMsg = await Promise.race([
                sendMenuImage(),
                new Promise((_, reject) => setTimeout(() => reject(new Error('Image send timeout')), 10000))
            ]);
        } catch (e) {
            console.log('Menu send error:', e);
            if (!sentMsg) {
                sentMsg = await conn.sendMessage(
                    from,
                    { text: menuCaption, contextInfo: contextInfo },
                    { quoted: mek }
                );
            }
        }

        const messageID = sentMsg.key.id;

        // all numbered submenus restored below
        const menuData = {
            '1568': { title: "*👑 DOWNLOAD MENU 👑*", content: `*╭━━━〔 👑 DOWNLOAD 👑 〕━━━┈⊷*
┃👑│ • fb 
┃👑│ • tiktok 
┃👑│ • Insta 
┃👑│ • apk 
┃👑│ • img   
┃👑│ • song 
┃👑│ • play 
┃👑│ • video  
*╰━━━━━━━━━━━━━━━┈⊷*
*👑 BILAL-MD WHATSAPP BOT 👑*`, image: true },

            '2': { title: "*👑 GROUP MENU 👑*", content: `*╭━━━〔 👑 GROUP MENU 👑 〕━━━┈⊷*
┃👑│ • add 
┃👑│ • remove 
┃👑│ • kick 
┃👑│ • promote 
┃👑│ • demote 
┃👑│ • tagall 
┃👑│ • mute 
┃👑│ • unmute 
*╰━━━━━━━━━━━━━━━┈⊷*
*👑 BILAL-MD WHATSAPP BOT 👑*`, image: true },

            '180': { title: "😄 *Fun Menu* 😄", content: `╭━━━〔 *Fun Menu* 〕━━━┈⊷
┃★│ • joke
┃★│ • hack @user
┃★│ • rate @user
┃★│ • pickup
*╰━━━━━━━━━━━━━━━┈⊷*`, image: true },

            '18494': { title: "*👑 USER MENU 👑*", content: `╭━━━〔 *👑 USER MENU 👑 〕━━━┈⊷
┃👑│ • block 
┃👑│ • unblock 
┃👑│ • fullpp 
┃👑│ • setpp 
┃👑│ • restart
┃👑│ • updatecmd
*╰━━━━━━━━━━━━━━━┈⊷*`, image: true },

            '94949': { title: "*👑 Ai MENU 👑*", content: `*╭━━━〔 👑 Ai MENU 👑 〕━━━┈⊷*
┃★│ • ai 
┃★│ • gpt 
┃★│ • bing 
┃★│ • imagine 
*╰━━━━━━━━━━━━━━━┈⊷*`, image: true },

            '64979': { title: "*👑 CONVERTER MENU 👑*", content: `*╭━━━〔 👑 CONVERTER 👑 〕━━━┈⊷*
┃👑│ • sticker 
┃👑│ • emojimix 😎+😂
┃👑│ • tomp3 
┃👑│ • fancy 
┃👑│ • trt 
*╰━━━━━━━━━━━━━━━┈⊷*`, image: true },

            '79797': { title: "*👑 XTRA MENU 👑*", content: `*╭━━━〔 👑 XTRA MENU 👑 〕━━━┈⊷*
┃👑│ • timenow
┃👑│ • date
┃👑│ • flip
┃👑│ • roll
┃👑│ • fact
┃👑│ • define 
┃👑│ • weather 
*╰━━━━━━━━━━━━━━━┈⊷*`, image: true },

            '797974': { title: "*👑 MAIN MENU 👑*", content: `*╭━━━〔 👑 MAIN MENU 👑 〕━━━┈⊷*
┃👑│ • ping
┃👑│ • alive
┃👑│ • uptime
┃👑│ • repo
┃👑│ • owner
┃👑│ • menu
┃👑│ • restart
*╰━━━━━━━━━━━━━━━┈⊷*`, image: true }
        };

        // message handler (reply system)
        const handler = async (msgData) => {
            try {
                const receivedMsg = msgData.messages[0];
                if (!receivedMsg?.message || !receivedMsg.key?.remoteJid) return;
                const isReplyToMenu = receivedMsg.message.extendedTextMessage?.contextInfo?.stanzaId === messageID;

                if (isReplyToMenu) {
                    const receivedText = receivedMsg.message.conversation || receivedMsg.message.extendedTextMessage?.text;
                    const senderID = receivedMsg.key.remoteJid;

                    if (menuData[receivedText]) {
                        const selectedMenu = menuData[receivedText];
                        if (selectedMenu.image) {
                            await conn.sendMessage(senderID, {
                                image: { url: config.MENU_IMAGE_URL || 'https://files.catbox.moe/kunzpz.png' },
                                caption: selectedMenu.content,
                                contextInfo: contextInfo
                            }, { quoted: receivedMsg });
                        } else {
                            await conn.sendMessage(senderID, {
                                text: selectedMenu.content,
                                contextInfo: contextInfo
                            }, { quoted: receivedMsg });
                        }

                        await conn.sendMessage(senderID, {
                            react: { text: '🔰', key: receivedMsg.key }
                        });
                    } else {
                        await conn.sendMessage(senderID, {
                            text: `*GG....☺️* \n *BILAL-MD BOT KA MENU AUR COMMANDS APKE SAMNE HAI 🥰🌹*`,
                            contextInfo: contextInfo
                        }, { quoted: receivedMsg });
                    }
                }
            } catch (e) {
                console.log('Handler error:', e);
            }
        };

        conn.ev.on("messages.upsert", handler);
        setTimeout(() => conn.ev.off("messages.upsert", handler), 300000);

    } catch (e) {
        console.error('ERROR:', e);
        await conn.sendMessage(from, { text: `_MERE BOT ME KOI ERROR HAI SHAYAD IS LIE MENU SHOW NAHI HO RAHA YEH PROBLEM BAHUT JALDI FIX HO JAYE GE_` }, { quoted: mek });
    }
});
