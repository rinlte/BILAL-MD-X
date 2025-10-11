const { cmd } = require('../command');
const axios = require('axios');

cmd({
  pattern: 'checkapikey',
  alias: ['checkkey', 'apikey'],
  desc: 'Check validity/info of API key at api.princetechn.com',
  category: 'tools',
  react: '🔑',
  filename: __filename
}, async (conn, mek, m, { from, reply, args }) => {
  try {
    // user may pass key as argument: .checkapikey <key>
    const userKey = (args && args[0]) ? args[0].trim() : (process.env.PRINCE_API_KEY || 'prince');

    if (!userKey) {
      return reply('⚠️ API key provide karo. Example: `.checkapikey prince`');
    }

    await reply(`⏳ Checking API key: *${userKey}* ...`);

    const url = `https://api.princetechn.com/checkapikey?apikey=${encodeURIComponent(userKey)}`;

    const res = await axios.get(url, { timeout: 15000 });
    const data = res.data;

    // Prepare a friendly message depending on response shape
    let out = `🔍 API Key Check Result\n\n• Key: ${userKey}\n`;

    // Common possible fields — try to show helpful info
    if (typeof data === 'object') {
      // If there's a message/status field
      if (data.status) out += `• Status: ${data.status}\n`;
      if (data.success !== undefined) out += `• Success: ${data.success}\n`;
      if (data.message) out += `• Message: ${data.message}\n`;
      // show any other useful top-level fields (limit)
      const extras = { ...data };
      delete extras.status; delete extras.success; delete extras.message;
      const keys = Object.keys(extras);
      if (keys.length) {
        out += `\n• Other data:\n`;
        for (const k of keys.slice(0, 10)) {
          try {
            out += `  └ ${k}: ${typeof extras[k] === 'object' ? JSON.stringify(extras[k]) : String(extras[k])}\n`;
          } catch (e) {
            out += `  └ ${k}: (unserializable)\n`;
          }
        }
      }
    } else {
      // If API returns plain text
      out += `• Response: ${String(data)}`;
    }

    // Final reply
    await conn.sendMessage(from, { text: out }, { quoted: m });

  } catch (err) {
    console.error('checkapikey error:', err?.response?.data || err.message || err);
    // If server returned a JSON error body show it
    if (err.response && err.response.data) {
      try {
        await conn.sendMessage(from, { text: `❌ API Error:\n${JSON.stringify(err.response.data, null, 2)}` }, { quoted: m });
      } catch (_) {
        reply('❌ API returned an error. Check console for details.');
      }
    } else {
      reply('❌ Koi error aaya — network ya API problem ho sakti hai. Console check karo.');
    }
  }
});
