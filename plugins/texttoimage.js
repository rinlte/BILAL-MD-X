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
        if (!response.data || response.data.length === 0) throw new Error('API returned empty response');
        const filePath = path.join(tmpDir, fileName);
        fs.writeFileSync(filePath, response.data);
        return filePath;
    } catch (err) {
        console.error('Error generating image:', err.message || err);
        return null;
    }
}

/* ---------------- Galaxy ---------------- */
cmd({
    pattern: 'galaxy',
    desc: 'Generate Galaxy text image',
    react: '🌌',
    async handler(m, { text, client }) {
        if (!text) return m.reply('❌ How to use: type "galaxy <your text>", jaise: galaxy Umar');

        const imagePath = await generateImage(
            'https://api.princetechn.com/api/ephoto360/galaxy?apikey=prince&text=',
            text,
            'galaxy.png'
        );

        if (imagePath) {
            try {
                await client.sendMessage(m.chat, { image: fs.readFileSync(imagePath), caption: `Here is your Galaxy image for "${text}"` }, { quoted: m });
            } catch (err) {
                console.error('Error sending Galaxy image:', err);
                m.reply('⚠️ Image send nahi ho payi, dubara try karo.');
            }
        } else {
            m.reply('⚠️ Galaxy image generate nahi hui, dubara try karo.');
        }
    }
});

/* ---------------- Summer Beach ---------------- */
cmd({
    pattern: 'summerbeach',
    desc: 'Generate Summer Beach text image',
    react: '🏖️',
    async handler(m, { text, client }) {
        if (!text) return m.reply('❌ How to use: type "summerbeach <your text>", jaise: summerbeach Umar');

        const imagePath = await generateImage(
            'https://api.princetechn.com/api/ephoto360/summerbeach?apikey=prince&text=',
            text,
            'summerbeach.png'
        );

        if (imagePath) {
            try {
                await client.sendMessage(m.chat, { image: fs.readFileSync(imagePath), caption: `Here is your Summer Beach image for "${text}"` }, { quoted: m });
            } catch (err) {
                console.error('Error sending Summer Beach image:', err);
                m.reply('⚠️ Image send nahi ho payi, dubara try karo.');
            }
        } else {
            m.reply('⚠️ Summer Beach image generate nahi hui, dubara try karo.');
        }
    }
});

/* ---------------- Effect Clouds ---------------- */
cmd({
    pattern: 'effectclouds',
    desc: 'Generate Effect Clouds text image',
    react: '☁️',
    async handler(m, { text, client }) {
        if (!text) return m.reply('❌ How to use: type "effectclouds <your text>", jaise: effectclouds Umar');

        const imagePath = await generateImage(
            'https://api.princetechn.com/api/ephoto360/effectclouds?apikey=prince&text=',
            text,
            'effectclouds.png'
        );

        if (imagePath) {
            try {
                await client.sendMessage(m.chat, { image: fs.readFileSync(imagePath), caption: `Here is your Effect Clouds image for "${text}"` }, { quoted: m });
            } catch (err) {
                console.error('Error sending Effect Clouds image:', err);
                m.reply('⚠️ Image send nahi ho payi, dubara try karo.');
            }
        } else {
            m.reply('⚠️ Effect Clouds image generate nahi hui, dubara try karo.');
        }
    }
});

/* ---------------- Cartoon Style ---------------- */
cmd({
    pattern: 'cartoonstyle',
    desc: 'Generate Cartoon Style text image',
    react: '🖌️',
    async handler(m, { text, client }) {
        if (!text) return m.reply('❌ How to use: type "cartoonstyle <your text>", jaise: cartoonstyle Umar');

        const imagePath = await generateImage(
            'https://api.princetechn.com/api/ephoto360/cartoonstyle?apikey=prince&text=',
            text,
            'cartoonstyle.png'
        );

        if (imagePath) {
            try {
                await client.sendMessage(m.chat, { image: fs.readFileSync(imagePath), caption: `Here is your Cartoon Style image for "${text}"` }, { quoted: m });
            } catch (err) {
                console.error('Error sending Cartoon Style image:', err);
                m.reply('⚠️ Image send nahi ho payi, dubara try karo.');
            }
        } else {
            m.reply('⚠️ Cartoon Style image generate nahi hui, dubara try karo.');
        }
    }
});

/* ---------------- Underwater ---------------- */
cmd({
    pattern: 'underwater',
    desc: 'Generate Underwater text image',
    react: '🌊',
    async handler(m, { text, client }) {
        if (!text) return m.reply('❌ How to use: type "underwater <your text>", jaise: underwater Umar');

        const imagePath = await generateImage(
            'https://api.princetechn.com/api/ephoto360/underwater?apikey=prince&text=',
            text,
            'underwater.png'
        );

        if (imagePath) {
            try {
                await client.sendMessage(m.chat, { image: fs.readFileSync(imagePath), caption: `Here is your Underwater image for "${text}"` }, { quoted: m });
            } catch (err) {
                console.error('Error sending Underwater image:', err);
                m.reply('⚠️ Image send nahi ho payi, dubara try karo.');
            }
        } else {
            m.reply('⚠️ Underwater image generate nahi hui, dubara try karo.');
        }
    }
});

/* ---------------- Deleting Text ---------------- */
cmd({
    pattern: 'deletingtext',
    desc: 'Generate Deleting Text image',
    react: '❌',
    async handler(m, { text, client }) {
        if (!text) return m.reply('❌ How to use: type "deletingtext <your text>", jaise: deletingtext Umar');

        const imagePath = await generateImage(
            'https://api.princetechn.com/api/ephoto360/deletingtext?apikey=prince&text=',
            text,
            'deletingtext.png'
        );

        if (imagePath) {
            try {
                await client.sendMessage(m.chat, { image: fs.readFileSync(imagePath), caption: `Here is your Deleting Text image for "${text}"` }, { quoted: m });
            } catch (err) {
                console.error('Error sending Deleting Text image:', err);
                m.reply('⚠️ Image send nahi ho payi, dubara try karo.');
            }
        } else {
            m.reply('⚠️ Deleting Text image generate nahi hui, dubara try karo.');
        }
    }
});

/* ---------------- Blackpink Style ---------------- */
cmd({
    pattern: 'blackpinkstyle',
    desc: 'Generate Blackpink Style image',
    react: '🎤',
    async handler(m, { text, client }) {
        if (!text) return m.reply('❌ How to use: type "blackpinkstyle <your text>", jaise: blackpinkstyle Umar');

        const imagePath = await generateImage(
            'https://api.princetechn.com/api/ephoto360/blackpinkstyle?apikey=prince&text=',
            text,
            'blackpinkstyle.png'
        );

        if (imagePath) {
            try {
                await client.sendMessage(m.chat, { image: fs.readFileSync(imagePath), caption: `Here is your Blackpink Style image for "${text}"` }, { quoted: m });
            } catch (err) {
                console.error('Error sending Blackpink Style image:', err);
                m.reply('⚠️ Image send nahi ho payi, dubara try karo.');
            }
        } else {
            m.reply('⚠️ Blackpink Style image generate nahi hui, dubara try karo.');
        }
    }
});

/* ---------------- Neon Glitch ---------------- */
cmd({
    pattern: 'neonglitch',
    desc: 'Generate Neon Glitch image',
    react: '💡',
    async handler(m, { text, client }) {
        if (!text) return m.reply('❌ How to use: type "neonglitch <your text>", jaise: neonglitch Umar');

        const imagePath = await generateImage(
            'https://api.princetechn.com/api/ephoto360/neonglitch?apikey=prince&text=',
            text,
            'neonglitch.png'
        );

        if (imagePath) {
            try {
                await client.sendMessage(m.chat, { image: fs.readFileSync(imagePath), caption: `Here is your Neon Glitch image for "${text}"` }, { quoted: m });
            } catch (err) {
                console.error('Error sending Neon Glitch image:', err);
                m.reply('⚠️ Image send nahi ho payi, dubara try karo.');
            }
        } else {
            m.reply('⚠️ Neon Glitch image generate nahi hui, dubara try karo.');
        }
    }
});

/* ---------------- Advanced Glow ---------------- */
cmd({
    pattern: 'advancedglow',
    desc: 'Generate Advanced Glow image',
    react: '✨',
    async handler(m, { text, client }) {
        if (!text) return m.reply('❌ How to use: type "advancedglow <your text>", jaise: advancedglow Umar');

        const imagePath = await generateImage(
            'https://api.princetechn.com/api/ephoto360/advancedglow?apikey=prince&text=',
            text,
            'advancedglow.png'
        );

        if (imagePath) {
            try {
                await client.sendMessage(m.chat, { image: fs.readFileSync(imagePath), caption: `Here is your Advanced Glow image for "${text}"` }, { quoted: m });
            } catch (err) {
                console.error('Error sending Advanced Glow image:', err);
                m.reply('⚠️ Image send nahi ho payi, dubara try karo.');
            }
        } else {
            m.reply('⚠️ Advanced Glow image generate nahi hui, dubara try karo.');
        }
    }
});

/* ---------------- Glitch Text ---------------- */
cmd({
    pattern: 'glitchtext',
    desc: 'Generate Glitch Text image',
    react: '⚡',
    async handler(m, { text, client }) {
        if (!text) return m.reply('❌ How to use: type "glitchtext <your text>", jaise: glitchtext Umar');

        const imagePath = await generateImage(
            'https://api.princetechn.com/api/ephoto360/glitchtext?apikey=prince&text=',
            text,
            'glitchtext.png'
        );

        if (imagePath) {
            try {
                await client.sendMessage(m.chat, { image: fs.readFileSync(imagePath), caption: `Here is your Glitch Text image for "${text}"` }, { quoted: m });
            } catch (err) {
                console.error('Error sending Glitch Text image:', err);
                m.reply('⚠️ Image send nahi ho payi, dubara try karo.');
            }
        } else {
            m.reply('⚠️ Glitch Text image generate nahi hui, dubara try karo.');
        }
    }
});

/* ---------------- Blackpink Logo ---------------- */
cmd({
    pattern: 'blackpinklogo',
    desc: 'Generate Blackpink Logo image',
    react: '🖤',
    async handler(m, { text, client }) {
        if (!text) return m.reply('❌ How to use: type "blackpinklogo <your text>", jaise: blackpinklogo Umar');

        const imagePath = await generateImage(
            'https://api.princetechn.com/api/ephoto360/blackpinklogo?apikey=prince&text=',
            text,
            'blackpinklogo.png'
        );

        if (imagePath) {
            try {
                await client.sendMessage(m.chat, { image: fs.readFileSync(imagePath), caption: `Here is your Blackpink Logo image for "${text}"` }, { quoted: m });
            } catch (err) {
                console.error('Error sending Blackpink Logo image:', err);
                m.reply('⚠️ Image send nahi ho payi, dubara try karo.');
            }
        } else {
            m.reply('⚠️ Blackpink Logo image generate nahi hui, dubara try karo.');
        }
    }
});

/* ---------------- Write Text ---------------- */
cmd({
    pattern: 'writetext',
    desc: 'Generate Write Text image',
    react: '✍️',
    async handler(m, { text, client }) {
        if (!text) return m.reply('❌ How to use: type "writetext <your text>", jaise: writetext Umar');

        const imagePath = await generateImage(
            'https://api.princetechn.com/api/ephoto360/writetext?apikey=prince&text=',
            text,
            'writetext.png'
        );

        if (imagePath) {
            try {
                await client.sendMessage(m.chat, { image: fs.readFileSync(imagePath), caption: `Here is your Write Text image for "${text}"` }, { quoted: m });
            } catch (err) {
                console.error('Error sending Write Text image:', err);
