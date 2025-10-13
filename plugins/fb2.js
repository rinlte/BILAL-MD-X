const axios = require("axios");
const { cmd } = require('../command');
const { fetchJson } = require('../lib/functions');

const api = `https://nethu-api-ashy.vercel.app`;

/**
 * Helper: facebook link check
 */
function extractFacebookLink(text) {
  if (!text) return null;
  const regex = /(https?:\/\/(?:www\.)?(?:facebook\.com|fb\.watch|fb\.com)\/[^\s]+)/i;
  const m = text.match(regex);
  return m ? m[0] : null;
}

/**
 * Core handler used by both command and auto-scan
 */
async function handleFbDownload({ conn, from, mek, q }) {
  try {
    const fbLink = extractFacebookLink(q);
    if (!fbLink) return;

    // react: downloading
    try { await conn.sendMessage(from, { react: { text: "🥺", key: mek.key } }); } catch (e){}

    // waiting message
    let waitMsg = null;
    try {
      waitMsg = await conn.sendMessage(from, { text: "*APKI FACEBOOK KI VIDEO DOWNLOAD HO RAHI HAI....😇🌹*" }, { quoted: mek });
    } catch(e){}

    // fetch API
    const fb = await fetchJson(`${api}/download/fbdown?url=${encodeURIComponent(fbLink)}`);

    // no result
    if (!fb || !fb.result || (!fb.result.hd && !fb.result.sd)) {
      try { if (waitMsg && waitMsg.key) await conn.sendMessage(from, { delete: waitMsg.key }); } catch(e){}
      try { await conn.sendMessage(from, { react: { text: "😔", key: mek.key } }); } catch(e){}
      return conn.sendMessage(from, { text: "*APKI FACEBOOK VIDEO NAHI MILI 😔*", quoted: mek });
    }

    // choose HD first, fallback SD
    const videoUrl = fb.result.hd || fb.result.sd;

    // send video
    await conn.sendMessage(from, {
      video: { url: videoUrl },
      mimetype: "video/mp4",
      caption: "*👑 BILAL-MD WHATSAPP BOT 👑*"
    }, { quoted: mek });

    // success react
    try { await conn.sendMessage(from, { react: { text: "☺️", key: mek.key } }); } catch(e){}

    // delete waiting message
    try { if (waitMsg && waitMsg.key) await conn.sendMessage(from, { delete: waitMsg.key }); } catch(e){}

  } catch (err) {
    console.error("handleFbDownload err:", err);
    try { await conn.sendMessage(from, { react: { text: "😔", key: mek.key } }); } catch(e){}
    try { conn.sendMessage(from, { text: "*APKI FACEBOOK VIDEO NAHI MILI 😔*", quoted: mek }); } catch(e){}
  }
}

/**
 * Command: fb2
 */
cmd({
  pattern: "fb2",
  alias: ["fbb2", "fbvideo2"],
  desc: "Download Facebook videos (HD/SD fallback)",
  category: "download",
  react: "🎥",
  filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
  try {
    if (!q) {
      return reply("*AP KO KOI FACEBOOK KI VIDEO DOWNLOAD KARNI HAI TO US VIDEO KA LINK COPY KAR LO AUR AISE LIKHO:* \n\n`fb2 <video_link>`\n\n*TOH APKI VIDEO DOWNLOAD HO JAYE GI AUR YAHAN SEND KAR DI JAYE GI.*");
    }
    await handleFbDownload({ conn, from, mek, q });
  } catch (err) {
    console.error(err);
  }
});

/**
 * Auto-scan incoming messages
 */
cmd({
  on: "message",
  filename: __filename
}, async (conn, mek, m, { from }) => {
  try {
    const body = (m && (m.text || m.message && (m.message.conversation || m.message.extendedTextMessage && m.message.extendedTextMessage.text))) || "";
    if (!body) return;

    const firstChar = body.trim().charAt(0);
    if ([".", "!", "/", "#"].includes(firstChar)) return; // ignore commands

    const fbLink = extractFacebookLink(body);
    if (!fbLink) return; // not facebook -> ignore

    await handleFbDownload({ conn, from, mek, q: fbLink });
  } catch (err) {
    console.error("auto-scan err:", err);
  }
});
