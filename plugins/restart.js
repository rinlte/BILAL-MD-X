const { cmd } = require("../command");  
const { sleep } = require("../lib/functions");  

cmd({  
    pattern: "restart",  
    desc: "Restart BILAL-MD",  
    category: "owner",  
    filename: __filename  
},  
async (conn, mek, m, { reply, isCreator }) => {  
    try {  
        if (!isCreator) {  
            return reply("*AP YE COMMAND USE NAHI KAR SAKTE 🥺❤️* \n *YEH COMMAND SIRF MERE LIE HAI ☺️❤️*");  
        }  

        const { exec } = require("child_process");  
        reply("*👑 BILAL-MD WHATSAPP BOT 👑* \n *RESTART HO RAHA HAI...☺️🌹* \n");  
        await sleep(1500);  
        exec("pm2 restart all");  
    } catch (e) {  
        console.error(e);  
        reply(`${e}`);  
    }  
});
