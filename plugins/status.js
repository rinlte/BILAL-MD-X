const { cmd } = require('../command');
const config = require('../config');
const moment = require('moment-timezone');
const { runtime, botpic } = require('../lib/functions');
const speed = require('performance-now');
const os = require('os');

cmd({
    pattern: "status",
    alias: ["about"],
    desc: "To check bot status",
    category: "general",
    react: "📃",
    filename: __filename
},
async (Void, citel, text, { from, reply }) => {
    try {
        const timestampe = speed();
        const latensie = speed() - timestampe;
        const uptime = runtime(process.uptime());
        const totalMem = os.totalmem();
        const freeMem = os.freemem();
        const usedMem = totalMem - freeMem;
        const memUsage = `${(usedMem / 1024 / 1024).toFixed(0)}MB / ${(totalMem / 1024 / 1024).toFixed(0)}MB`;

        const time = moment().tz('Asia/Karachi').format('HH:mm:ss');
        const date = moment().tz('Asia/Karachi').format('DD/MM/YYYY');

        const caption = `
╭═══〘  *🤖 ${config.botname || "BILAL-MD"} STATUS* 〙═══⊷❍
│
│ *👤 Owner:* ${config.ownername}
│ *📱 Number:* ${config.ownernumber}
│ *⚡ Speed:* ${latensie.toFixed(2)} ms
│ *⏱ Uptime:* ${uptime}
│ *💾 RAM:* ${memUsage}
│ *🕐 Time:* ${time}
│ *📅 Date:* ${date}
│ *🌍 Platform:* ${os.platform().toUpperCase()}
│ *🧠 Version:* 0.0.8
│
╰───────────────⊷❍
*Powered by ${config.botname || "BILAL-MD"} 💎*
`;

        const buttonMessage = {
            image: { url: await botpic() },
            caption: caption,
            headerType: 4,
            contextInfo: {
                externalAdReply: {
                    title: config.botname || "BILAL-MD",
                    body: "Bot Status Information",
                    thumbnail: await botpic(),
                    mediaType: 2,
                    sourceUrl: "https://whatsapp.com/channel/0029Vaj3Xnu17EmtDxTNnQ0G"
                }
            }
        };

        await Void.sendMessage(from, buttonMessage, { quoted: citel });
    } catch (e) {
        console.log("Status cmd error:", e);
        await reply("⚠️ Error while fetching status info!");
    }
});
