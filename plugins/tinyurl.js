const { cmd } = require('../command');
const axios = require('axios');

// 👤 Fake quoted contact (for message styling)
const quotedContact = {
  key: {
    fromMe: false,
    participant: '0@s.whatsapp.net',
    remoteJid: 'status@broadcast'
  },
  message: {
    contactMessage: {
      displayName: 'DML VERIFIED ✅',
      vcard: `BEGIN:VCARD
VERSION:3.0
FN:DML VERIFIED ✅
ORG:DML-TECH BOT;
TEL;type=CELL;type=VOICE;waid=255622220680:+255713541112
END:VCARD`
    }
  }
};

// 📢 Context info for forwarded look
const newsletterContext = {
  contextInfo: {
    forwardingScore: 999,
    isForwarded: true,
    forwardedNewsletterMessageInfo: {
      newsletterJid: '120363318968953068@newsletter',
      newsletterName: 'DML Tech Official Channel',
      serverMessageId: 1
    }
  }
};

// ⚙️ Command: tiny (URL shortener)
cmd({
  pattern: 'tiny',
  alias: ['short', 'shorten'],
  react: '🕸',
  desc: 'Shorten a long URL using TinyURL service',
  category: 'tools',
  use: '.tiny <url>',
  filename: __filename
}, async (m, text, data, { from, reply, args }) => {

  // Agar user ne koi link nahi diya
  if (!args[0]) return reply('⚠️ Please provide a URL to shorten!\nExample: *.tiny https://example.com*');

  try {
    const longUrl = args[0];

    // 🔗 Call TinyURL API
    const response = await axios.get(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(longUrl)}`);
    const shortUrl = response.data;

    // ✉️ Response message
    const caption = `🕸 *TinyURL Shortener*  
🔗 Original: ${longUrl}  
➡️ Shortened: ${shortUrl}`;

    // 📨 Send message
    await m.sendMessage(from, { text: caption, ...newsletterContext }, { quoted: quotedContact });

  } catch (err) {
    console.log('Error shortening URL:', err);
    reply('❌ Failed to shorten the URL. Please try again later.');
  }
});
