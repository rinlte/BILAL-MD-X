const config = require('../config');
const { cmd, commands } = require('../command');
const { runtime } = require('../lib/functions');
const axios = require('axios');

cmd({
pattern: "menu",
desc: "Show interactive menu system",
category: "menu",
react: "🧾",
filename: __filename
}, async (conn, mek, m, { from, reply }) => {
try {
const menuCaption = `╭━━━〔 👑 BiLAL-MD 👑 〕━━━┈⊷
┃👑╭──────────────
┃👑│ USER:❯ ${config.OWNER_NAME}
┃👑│ DEVELOPER :❯ BiLAL
┃👑│ PLATFORM :❯ LiNUX
┃👑│ MODE :❯ ${config.MODE}
┃👑│ PREFiX :❯ ${config.PREFIX}
┃👑│ VERSION :❯ 1.0
┃👑╰──────────────
╰━━━━━━━━━━━━━━━┈⊷

╭━━〔 👑 DOWNLOAD MENU 👑 〕━━┈⊷
┃👑│ • FB
┃👑│ • TIKTOK
┃👑│ • INSTA
┃👑│ • APK
┃👑│ • IMG
┃👑│ • SONG
┃👑│ • PLAY
┃👑│ • VIDEO
╰━━━━━━━━━━━━━━━┈⊷

╭━━〔 👑 GROUP MENU 👑 〕━━┈⊷
┃👑│ • GROUPLINK
┃👑│ • KICKALL
┃👑│ • KICKALL2
┃👑│ • KICKALL3
┃👑│ • ADD
┃👑│ • REMOVE
┃👑│ • KICK
┃👑│ • PROMOTE
┃👑│ • DEMOTE
┃👑│ • DISMISS
┃👑│ • REVOKE
┃👑│ • MUTE
┃👑│ • UNMUTE
┃👑│ • LOCKGC
┃👑│ • UNLOCKGC
┃👑│ • TAG
┃👑│ • HIDETAG
┃👑│ • TAGALL
┃👑│ • TAGADMINS
┃👑│ • INVITE
╰━━━━━━━━━━━━━━━┈⊷

╭━━〔 👑 USER MENU 👑 〕━━┈⊷
┃👑│ • BLOCK
┃👑│ • UNBLOCK
┃👑│ • FULLPP
┃👑│ • SETPP
┃👑│ • GETPP
┃👑│ • RESTART
┃👑│ • UPDATECMD
╰━━━━━━━━━━━━━━━┈⊷

╭━━〔 👑 AI MENU 👑 〕━━┈⊷
┃👑│ • AI
┃👑│ • GPT
┃👑│ • BING
┃👑│ • IMAGINE
╰━━━━━━━━━━━━━━━┈⊷

╭━━〔 👑 LOGO MENU 👑 〕━━┈⊷
┃👑│ • LOGO1
┃👑│ • LOGO2
┃👑│ • LOGO3
┃👑│ • LOGO4
┃👑│ • LOGO5
┃👑│ • LOGO6
┃👑│ • LOGO7
┃👑│ • LOGO8
┃👑│ • LOGO9
┃👑│ • LOGO10
┃👑│ • LOGO11
┃👑│ • LOGO12
┃👑│ • LOGO13
┃👑│ • LOGO14
┃👑│ • LOGO15
┃👑│ • LOGO16
┃👑│ • LOGO17
┃👑│ • LOGO18
┃👑│ • LOGO19
┃👑│ • LOGO20
╰━━━━━━━━━━━━━━━┈⊷

╭━━〔 👑 CONVERTER MENU 👑 〕━━┈⊷
┃👑│ • STICKER
┃👑│ • EMOJIMIX
┃👑│ • TAKE
┃👑│ • TOMP3
┃👑│ • FANCY
┃👑│ • TTS
┃👑│ • TRT
┃👑│ • BASE64
┃👑│ • UNBASE64
╰━━━━━━━━━━━━━━━┈⊷

╭━━〔 👑 XTRA MENU 👑 〕━━┈⊷
┃👑│ • TIMENOW
┃👑│ • DATE
┃👑│ • FLIP
┃👑│ • COINFLIP
┃👑│ • RCOLOR
┃👑│ • ROLL
┃👑│ • SS
┃👑│ • NEWS
┃👑│ • MOVIE
┃👑│ • WEATHER
╰━━━━━━━━━━━━━━━┈⊷

╭━━〔 👑 MAIN MENU 👑 〕━━┈⊷
┃👑│ • PING
┃👑│ • ALIVE
┃👑│ • RUNTIME
┃👑│ • UPTIME
┃👑│ • REPO
┃👑│ • OWNER
┃👑│ • MENU
┃👑│ • LIST
┃👑│ • RESTART
╰━━━━━━━━━━━━━━━┈⊷

👑 BILAL-MD WHATSAPP BOT 👑`;

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

    // Function to send menu audio with timeout  
    const sendMenuAudio = async () => {  
        try {  
            await new Promise(resolve => setTimeout(resolve, 1000)); // Small delay after image  
            await conn.sendMessage(from, {  
                audio: { url: 'https://files.catbox.moe/kfsn0s.mp3' },  
                mimetype: 'audio/mp4',  
                ptt: true,  
            }, { quoted: mek });  
        } catch (e) {  
            console.log('Audio send failed, continuing without it');  
        }  
    };  

    // Send image first, then audio sequentially  
    let sentMsg;  
    try {  
        sentMsg = await Promise.race([  
            sendMenuImage(),  
            new Promise((_, reject) => setTimeout(() => reject(new Error('Image send timeout')), 10000))  
        ]);  
          
        await Promise.race([  
            sendMenuAudio(),  
            new Promise((_, reject) => setTimeout(() => reject(new Error('Audio send timeout')), 8000))  
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

    // EMPTY menuData (numbers wale menus delete kar diye)  
    const menuData = {};  

    // Message handler  
    const handler = async (msgData) => {  
        try {  
            const receivedMsg = msgData.messages[0];  
            if (!receivedMsg?.message || !receivedMsg.key?.remoteJid) return;  

            const isReplyToMenu = receivedMsg.message.extendedTextMessage?.contextInfo?.stanzaId === messageID;  
              
            if (isReplyToMenu) {  
                const senderID = receivedMsg.key.remoteJid;  
                await conn.sendMessage(  
                    senderID,  
                    { text: `*GG BILAL-MD BOT KA MENU AUR COMMANDS APKE SAMNE HAI 😊❤️*`, contextInfo: contextInfo },  
                    { quoted: receivedMsg }  
                );  
            }  
        } catch (e) {  
            console.log('Handler error:', e);  
        }  
    };  

    conn.ev.on("messages.upsert", handler);  

    setTimeout(() => {  
        conn.ev.off("messages.upsert", handler);  
    }, 300000);  

} catch (e) {  
    console.error('Menu Error:', e);  
    try {  
        await conn.sendMessage(  
            from,  
            { text: `❌ Menu system is currently busy. Please try again later.\n\n> ${config.DESCRIPTION}` },  
            { quoted: mek }  
        );  
    } catch (finalError) {  
        console.log('Final error handling failed:', finalError);  
    }  
}

});
