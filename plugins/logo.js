const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { cmd } = require('../command');

// Ensure tmp folder exists
const tmpDir = path.join(__dirname, '../tmp');
if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir);

// Helper function to generate image
async function generateImage(apiUrl, text, fileName) {
    try {
        const response = await axios.get(`${apiUrl}${encodeURIComponent(text)}`, { responseType: 'arraybuffer' });
        const filePath = path.join(tmpDir, fileName);
        fs.writeFileSync(filePath, response.data);
        return filePath;
    } catch (err) {
        console.error(err);
        return null;
    }
}

// ---------------- Individual Commands ----------------

// 1. Galaxy
cmd({
    pattern: 'galaxy',
    desc: 'Generate Galaxy text image',
    react: '🌌',
    async handler(m, { text, client }) {
        if (!text) return m.reply('❌ Text provide karo, jaise: galaxy Prince Tech');
        const imagePath = await generateImage('https://api.princetechn.com/api/ephoto360/galaxy?apikey=prince&text=', text, 'galaxy.png');
        if (imagePath) await client.sendMessage(m.chat, { image: fs.readFileSync(imagePath) }, { quoted: m });
        else m.reply('⚠️ Image generate nahi hui, dubara try karo.');
    }
});

// 2. Summer Beach
cmd({
    pattern: 'summerbeach',
    desc: 'Generate Summer Beach text image',
    react: '🏖️',
    async handler(m, { text, client }) {
        if (!text) return m.reply('❌ Text provide karo, jaise: summerbeach Prince Tech');
        const imagePath = await generateImage('https://api.princetechn.com/api/ephoto360/summerbeach?apikey=prince&text=', text, 'summerbeach.png');
        if (imagePath) await client.sendMessage(m.chat, { image: fs.readFileSync(imagePath) }, { quoted: m });
        else m.reply('⚠️ Image generate nahi hui, dubara try karo.');
    }
});

// 3. Effect Clouds
cmd({
    pattern: 'effectclouds',
    desc: 'Generate Effect Clouds text image',
    react: '☁️',
    async handler(m, { text, client }) {
        if (!text) return m.reply('❌ Text provide karo, jaise: effectclouds Prince Tech');
        const imagePath = await generateImage('https://api.princetechn.com/api/ephoto360/effectclouds?apikey=prince&text=', text, 'effectclouds.png');
        if (imagePath) await client.sendMessage(m.chat, { image: fs.readFileSync(imagePath) }, { quoted: m });
        else m.reply('⚠️ Image generate nahi hui, dubara try karo.');
    }
});

// 4. Cartoon Style
cmd({
    pattern: 'cartoonstyle',
    desc: 'Generate Cartoon Style text image',
    react: '🖌️',
    async handler(m, { text, client }) {
        if (!text) return m.reply('❌ Text provide karo, jaise: cartoonstyle Prince Tech');
        const imagePath = await generateImage('https://api.princetechn.com/api/ephoto360/cartoonstyle?apikey=prince&text=', text, 'cartoonstyle.png');
        if (imagePath) await client.sendMessage(m.chat, { image: fs.readFileSync(imagePath) }, { quoted: m });
        else m.reply('⚠️ Image generate nahi hui, dubara try karo.');
    }
});

// 5. Underwater
cmd({
    pattern: 'underwater',
    desc: 'Generate Underwater text image',
    react: '🌊',
    async handler(m, { text, client }) {
        if (!text) return m.reply('❌ Text provide karo, jaise: underwater Prince Tech');
        const imagePath = await generateImage('https://api.princetechn.com/api/ephoto360/underwater?apikey=prince&text=', text, 'underwater.png');
        if (imagePath) await client.sendMessage(m.chat, { image: fs.readFileSync(imagePath) }, { quoted: m });
        else m.reply('⚠️ Image generate nahi hui, dubara try karo.');
    }
});

// 6. Deleting Text
cmd({
    pattern: 'deletingtext',
    desc: 'Generate Deleting Text image',
    react: '❌',
    async handler(m, { text, client }) {
        if (!text) return m.reply('❌ Text provide karo, jaise: deletingtext Prince Tech');
        const imagePath = await generateImage('https://api.princetechn.com/api/ephoto360/deletingtext?apikey=prince&text=', text, 'deletingtext.png');
        if (imagePath) await client.sendMessage(m.chat, { image: fs.readFileSync(imagePath) }, { quoted: m });
        else m.reply('⚠️ Image generate nahi hui, dubara try karo.');
    }
});

// 7. Blackpink Style
cmd({
    pattern: 'blackpinkstyle',
    desc: 'Generate Blackpink Style image',
    react: '🎤',
    async handler(m, { text, client }) {
        if (!text) return m.reply('❌ Text provide karo, jaise: blackpinkstyle Prince Tech');
        const imagePath = await generateImage('https://api.princetechn.com/api/ephoto360/blackpinkstyle?apikey=prince&text=', text, 'blackpinkstyle.png');
        if (imagePath) await client.sendMessage(m.chat, { image: fs.readFileSync(imagePath) }, { quoted: m });
        else m.reply('⚠️ Image generate nahi hui, dubara try karo.');
    }
});

// 8. Neon Glitch
cmd({
    pattern: 'neonglitch',
    desc: 'Generate Neon Glitch image',
    react: '💡',
    async handler(m, { text, client }) {
        if (!text) return m.reply('❌ Text provide karo, jaise: neonglitch Prince Tech');
        const imagePath = await generateImage('https://api.princetechn.com/api/ephoto360/neonglitch?apikey=prince&text=', text, 'neonglitch.png');
        if (imagePath) await client.sendMessage(m.chat, { image: fs.readFileSync(imagePath) }, { quoted: m });
        else m.reply('⚠️ Image generate nahi hui, dubara try karo.');
    }
});

// 9. Advanced Glow
cmd({
    pattern: 'advancedglow',
    desc: 'Generate Advanced Glow image',
    react: '✨',
    async handler(m, { text, client }) {
        if (!text) return m.reply('❌ Text provide karo, jaise: advancedglow Prince Tech');
        const imagePath = await generateImage('https://api.princetechn.com/api/ephoto360/advancedglow?apikey=prince&text=', text, 'advancedglow.png');
        if (imagePath) await client.sendMessage(m.chat, { image: fs.readFileSync(imagePath) }, { quoted: m });
        else m.reply('⚠️ Image generate nahi hui, dubara try karo.');
    }
});

// 10. Glitch Text
cmd({
    pattern: 'glitchtext',
    desc: 'Generate Glitch Text image',
    react: '⚡',
    async handler(m, { text, client }) {
        if (!text) return m.reply('❌ Text provide karo, jaise: glitchtext Prince Tech');
        const imagePath = await generateImage('https://api.princetechn.com/api/ephoto360/glitchtext?apikey=prince&text=', text, 'glitchtext.png');
        if (imagePath) await client.sendMessage(m.chat, { image: fs.readFileSync(imagePath) }, { quoted: m });
        else m.reply('⚠️ Image generate nahi hui, dubara try karo.');
    }
});

// 11. Blackpink Logo
cmd({
    pattern: 'blackpinklogo',
    desc: 'Generate Blackpink Logo image',
    react: '🖤',
    async handler(m, { text, client }) {
        if (!text) return m.reply('❌ Text provide karo, jaise: blackpinklogo Prince Tech');
        const imagePath = await generateImage('https://api.princetechn.com/api/ephoto360/blackpinklogo?apikey=prince&text=', text, 'blackpinklogo.png');
        if (imagePath) await client.sendMessage(m.chat, { image: fs.readFileSync(imagePath) }, { quoted: m });
        else m.reply('⚠️ Image generate nahi hui, dubara try karo.');
    }
});

// 12. Write Text
cmd({
    pattern: 'writetext',
    desc: 'Generate Write Text image',
    react: '✍️',
    async handler(m, { text, client }) {
        if (!text) return m.reply('❌ Text provide karo, jaise: writetext Prince Tech');
        const imagePath = await generateImage('https://api.princetechn.com/api/ephoto360/writetext?apikey=prince&text=', text, 'writetext.png');
        if (imagePath) await client.sendMessage(m.chat, { image: fs.readFileSync(imagePath) }, { quoted: m });
        else m.reply('⚠️ Image generate nahi hui, dubara try karo.');
    }
});

// 13. Glossy Silver
cmd({
    pattern: 'glossysilver',
    desc: 'Generate Glossy Silver image',
    react: '🥈',
    async handler(m, { text, client }) {
        if (!text) return m.reply('❌ Text provide karo, jaise: glossysilver Prince Tech');
        const imagePath = await generateImage('https://api.princetechn.com/api/ephoto360/glossysilver?apikey=prince&text=', text, 'glossysilver.png');
        if (imagePath) await client.sendMessage(m.chat, { image: fs.readFileSync(imagePath) }, { quoted: m });
        else m.reply('⚠️ Image generate nahi hui, dubara try karo.');
    }
});
