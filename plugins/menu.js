const config = require('../config');
const { cmd, commands } = require('../command');
const Jimp = require("jimp");
const fs = require('fs');
const path = require('path');
const axios = require('axios');

// ✅ Auto-create temp folder
const tempDir = path.join(__dirname, '../temp');
if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

// ✅ Detect platform
function getPlatform() {
    if (process.env.HEROKU_APP_NAME) return "Heroku";
    if (process.env.KOYEB_API) return "Koyeb";
    if (process.env.RENDER) return "Render";
    if (process.env.TERMUX) return "Termux";
    return "Unknown";
}

cmd({
    pattern: "menu",
    desc: "Show interactive menu system",
    category: "menu",
    react: "👑",
    filename: __filename
}, async (conn, mek, m, { from, reply }) => {
    try {
        // 🧠 User info
        const userName = m.pushName || m.sender.split('@')[0];
        const userNumber = m.sender.split('@')[0];
        const displayName = userName ? userName : userNumber;

        // 🖼️ Profile pics
        let botPfp, userPfp;
        try { botPfp = await conn.profilePictureUrl(conn.user.id, 'image'); }
        catch { botPfp = 'https://files.catbox.moe/kunzpz.png'; }
        try { userPfp = await conn.profilePictureUrl(m.sender, 'image'); }
        catch { userPfp = 'https://files.catbox.moe/kunzpz.png'; }

        // ✅ Merge both DPs vertically
        const [img1, img2] = await Promise.all([Jimp.read(botPfp), Jimp.read(userPfp)]);
        const width = Math.max(img1.bitmap.width, img2.bitmap.width);
        const height = img1.bitmap.height + img2.bitmap.height;
        const merged = new Jimp(width, height);
        merged.composite(img1, 0, 0);
        merged.composite(img2, 0, img1.bitmap.height);
        const mergedPath = path.join(tempDir, 'merged_menu.jpg');
        await merged.writeAsync(mergedPath);

        // ✅ Caption
        const menuCaption = `*╭━━━〔 👑 BiLAL-MD 👑 〕━━━┈⊷*
*┃👑╭──────────────*
*┃👑│ USER:❯ ${config.OWNER_NAME}*
*┃👑│ USER:❯ ${config.OWNER_NUMBER}*
*┃👑│ MODE :❯ ${config.MODE}*
*┃👑│ PREFiX :❯ ${config.PREFIX}*
*┃👑│ COMMANDS :❯ ${commands.length}*
*┃👑│ PLATFORM :❯ ${getPlatform()}*
*┃👑╰──────────────*
*╰━━━━━━━━━━━━━━━┈⊷*

*HI ${displayName} G ☺️♥️*
*MERE BOT KA MENU 🥰🌹*
*YEH HAI G 🌺🌹*

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
*┃👑│ • TINYURL*
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

        // ✅ Send merged image first preference, fallback to config.MENU_IMAGE_URL if exists
        const sendMenuImage = async () => {
            const imageToSend = config.MENU_IMAGE_URL || mergedPath;
            try {
                return await conn.sendMessage(
                    from,
                    {
                        image: { url: imageToSend },
                        caption: menuCaption,
                        contextInfo
                    },
                    { quoted: mek }
                );
            } catch {
                console.log('Menu image send failed, using text');
                return await conn.sendMessage(from, { text: menuCaption, contextInfo }, { quoted: mek });
            }
        };

        // ⏳ Timeout protection
        let sentMsg;
        try {
            sentMsg = await Promise.race([
                sendMenuImage(),
                new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 10000))
            ]);
        } catch {
            sentMsg = await conn.sendMessage(from, { text: menuCaption, contextInfo }, { quoted: mek });
        }

        const messageID = sentMsg.key.id;

        // ✅ All existing numbered menus untouched
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

        // ✅ Listener for reply-based menu selection
        const handler = async (msgData) => {
            try {
                const receivedMsg = msgData.messages[0];
                if (!receivedMsg?.message || !receivedMsg.key?.remoteJid) return;
                const isReplyToMenu = receivedMsg.message.extendedTextMessage?.contextInfo?.stanzaId === messageID;
                if (isReplyToMenu) {
                    const receivedText = receivedMsg.message.conversation || receivedMsg.message.extendedTextMessage?.text;
                    const senderID = receivedMsg.key.remoteJid;
                    if (menuData[receivedText]) {
                        const selected = menuData[receivedText];
                        await conn.sendMessage(senderID, {
                            image: { url: config.MENU_IMAGE_URL || mergedPath },
                            caption: selected.content,
                            contextInfo
                        }, { quoted: receivedMsg });
                        await conn.sendMessage(senderID, { react: { text: '🔰', key: receivedMsg.key } });
                    }
                }
            } catch (e) { console.log('Handler error:', e); }
        };
        conn.ev.on("messages.upsert", handler);
        setTimeout(() => conn.ev.off("messages.upsert", handler), 300000);

    } catch (e) {
        console.error('MENU ERROR:', e);
        await conn.sendMessage(from, { text: '_⚠️ MENU SHOW KARTE WAQT ERROR AYA, YE JALDI FIX HO JAYEGA._' }, { quoted: mek });
    }
});
