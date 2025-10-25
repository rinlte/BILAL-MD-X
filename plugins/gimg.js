const { cmd } = require('../command');
const axios = require('axios');

cmd({
  pattern: "gimg",
  desc: "Search Google images via Dexter API. Usage: .gimg <query>",
  react: "🔎",
  category: "search",
  use: ".gimg apple",
  filename: __filename
}, async (conn, m, store, { from, args, reply }) => {
  try {
    if (!args || args.length === 0) return reply("❌ Usage: .gimg <search query>\nExample: .gimg apple");

    const query = args.join(" ");
    await reply(`🔎 Searching images for: *${query}* ...`);

    const apiUrl = 'https://api.id.dexter.it.com/search/google/image';
    const DEXTER_API_KEY = process.env.DEXTER_API_KEY || null;

    const headers = {};
    if (DEXTER_API_KEY) {
      headers['Authorization'] = `Bearer ${DEXTER_API_KEY}`;
      headers['x-api-key'] = DEXTER_API_KEY;
    }

    // Call API
    let res;
    try {
      res = await axios.get(apiUrl, {
        params: { q: query },
        headers,
        timeout: 20000,
        validateStatus: s => s < 500
      });
    } catch (e) {
      return reply("⚠️ API request failed: " + (e.message || String(e)));
    }

    const data = res.data || {};
    // Try to find an array of image items in common keys
    const candidates = data.results || data.items || data.data || data.images || [];
    if (!Array.isArray(candidates) || candidates.length === 0) {
      // Try nested fields or direct entries
      // If the response itself is an array
      if (Array.isArray(data)) {
        candidates.push(...data);
      }
    }
    // After these attempts if still empty, show fallback
    if (!candidates || candidates.length === 0) {
      // try to detect if response includes a single image url or base64
      if (data.image && typeof data.image === 'string') {
        candidates.push({ url: data.image });
      } else if (typeof data === 'string') {
        return reply("⚠️ API returned text response: " + data.slice(0,300));
      } else {
        return reply("❌ No images found in API response. The endpoint may require an API key or different params.");
      }
    }

    // Limit how many images we will attempt to send
    const limit = Math.min(3, candidates.length);

    // Helper to extract an image URL from an item
    const extractUrl = (item) => {
      if (!item) return null;
      // common shapes:
      // { url, image, thumbnail, link, src, img }
      return item.url || item.image || item.src || item.link || item.thumbnail || item.thumb || null;
    };

    let sentAny = false;
    for (let i = 0; i < limit; i++) {
      const item = candidates[i];
      const imageUrl = extractUrl(item) || (typeof item === 'string' ? item : null);

      if (!imageUrl) {
        // try stringify the item if it has a direct preview field
        const pretty = JSON.stringify(item).slice(0, 500);
        await reply(`🔸 Result ${i+1} (no direct image URL):\n\`\`\`\n${pretty}\n\`\`\``);
        continue;
      }

      // If returned url is data:image/base64
      if (imageUrl.startsWith('data:image/')) {
        const b64 = imageUrl.split(',')[1];
        const buf = Buffer.from(b64, 'base64');
        await conn.sendMessage(m.from, { image: buf, caption: `🔸 ${query} — result ${i+1}` }, { quoted: m });
        sentAny = true;
        continue;
      }

      // Otherwise fetch the image bytes
      try {
        const imgResp = await axios.get(imageUrl, { responseType: 'arraybuffer', timeout: 20000 });
        const ct = imgResp.headers['content-type'] || '';
        if (!ct.startsWith('image/')) {
          // Not an image — send the link instead
          await reply(`🔗 Result ${i+1} (not image content-type): ${imageUrl}`);
          continue;
        }
        const imgBuf = Buffer.from(imgResp.data);
        await conn.sendMessage(m.from, { image: imgBuf, caption: `🔸 ${query} — result ${i+1}\n${imageUrl}` }, { quoted: m });
        sentAny = true;
      } catch (e) {
        // couldn't fetch the image; send the URL instead
        await reply(`⚠️ Could not fetch image ${i+1}, sending link instead:\n${imageUrl}`);
      }
    }

    if (!sentAny) {
      await reply("⚠️ Koi image bhejne layak nahi mili. API response ka format alag ho sakta hai.");
    }

  } catch (err) {
    console.error(err);
    const em = (err && err.response && err.response.data) ? (typeof err.response.data === 'string' ? err.response.data.slice(0,300) : JSON.stringify(err.response.data).slice(0,300)) : (err.message || String(err));
    reply("❌ Error: " + em);
  }
});
