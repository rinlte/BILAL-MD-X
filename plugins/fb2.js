const axios = require("axios");
const { cmd } = require('../command');
const { fetchJson } = require('../lib/functions');

const api = `https://nethu-api-ashy.vercel.app`;

// Helper: Facebook link detect
function extractFacebookLink(text) {
  if (!text) return null;
  const regex = /(https?:\/\/(?:www\.)?(?:facebook\.com|fb\.watch|fb\.com)\/[^\s]+)/i;
  const m = text.match(regex);
  return m ? m[0] : null;
}

// Core download handler
async function handleFbDownload({ conn, from, mek, q }) {
  try {
    const fbLink = extractFacebookLink(q);
    if (!fbLink) return;

    // React & waiting message
    try { await conn.sendMessage(from, { react: { text: "⏳", key: mek.key } }); } catch(e){}
    let waitMsg = null;
    try { waitMsg = await conn.sendMessage(from, { text: "*APKI FACEBOOK KI VIDEO DOWNLOAD HO RAHI HAI....😇🌹*" }, { quoted: mek }); } catch(e){}

    // Fetch API
    const fb = await fetchJson(`${api}/download/fbdown?url=${encodeURIComponent(fbLink)}`);

    // No video case
    if (!fb || !fb.result || (!fb.result.hd && !fb.result.sd)) {
      try { if (waitMsg?.key) await conn.sendMessage(from, { delete: waitMsg.key }); } catch(e){}
      try { await conn.sendMessage(from, { react: { text: "😔", key: mek.key } }); } catch(e){}
      return conn.sendMessage(from, { text: "*APKI FACEBOOK VIDEO NAHI MILI 😔*", quoted: mek });
    }

    // HD first, fallback SD
    const videoUrl = fb.result.hd || fb.result.sd;

    // Send video
    await conn.sendMessage(from, {
      video: { url: videoUrl },
      mimetype: "video/mp4",
      caption: "*👑 BILAL-MD WHATSAPP BOT 👑*"
    }, { quoted: mek });

    // Success react
    try { await conn.sendMessage(from, { react: { text: "✅", key: mek.key } }); } catch(e){}

    // Delete waiting message
    try { if (waitMsg?.key) await conn.sendMessage(from, { delete: waitMsg.key }); } catch(e){}

  } catch (err) {
    console.error("handleFbDownload error:", err);
    try { await conn.sendMessage(from, { react: { text: "😔", key: mek.key } }); } catch(e){}
    try { conn.sendMessage(from, { text: "*APKI FACEBOOK VIDEO NAHI MILI 😔*", quoted: mek }); } catch(e){}
  }
}

/**
 * 1) Command: fb2
 */
cmd({
  pattern: "fb2",
  alias: ["fbb2", "fbvideo2"],
  desc: "Download Facebook videos (HD/SD fallback)",
  category: "download",
  react: "🎥",
  filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
  if (!q) {
    return reply("*AP KO KOI FACEBOOK KI VIDEO DOWNLOAD KARNI HAI TO US VIDEO KA LINK COPY KAR LO AUR AISE LIKHO:* \n\n`fb2 <video_link>`\n\n*TOH APKI VIDEO DOWNLOAD HO JAYE GI AUR YAHAN SEND KAR DI JAYE GI.*");
  }
  await handleFbDownload({ conn, from, mek, q });
});

/**
 * 2) Auto-scan incoming messages (without command)
 */
cmd({
  on: "message",
  filename: __filename
}, async (conn, mek, m, { from }) => {
  try {
    const body = (m && (m.text || m.message && (m.message.conversation || m.message.extendedTextMessage?.text))) || "";
    if (!body) return;

    // Ignore if user typed a command (starts with . ! / #)
    const firstChar = body.trim().charAt(0);
    if ([".", "!", "/", "#"].includes(firstChar)) return;

    const fbLink = extractFacebookLink(body);
    if (!fbLink) return; // not facebook link -> ignore

    await handleFbDownload({ conn, from, mek, q: fbLink });
  } catch (err) {
    console.error("auto-scan err:", err);
  }
});
