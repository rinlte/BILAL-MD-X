const axios = require("axios");

try {
  // ----- inputs (adjust if your handler provides different names) -----
  // 'provided' may come from earlier code — fallback to args[0] if not.
  const q = (typeof provided !== "undefined" && provided) || (Array.isArray(args) ? args[0] : undefined) || "";
  const keyForReact = (m && m.key) || (typeof mek !== "undefined" && mek.key) || null;

  if (!q) {
    // react + reply for missing input
    if (keyForReact) await conn.sendMessage(from, { react: { text: "😔", key: keyForReact } });
    return await reply("*APKA AUDIO KA LINK YA QUERY NAHI MILI 🥺*");
  }

  // show waiting message (declare variable so we can delete later)
  let waitingMsg = null;
  try {
    waitingMsg = await conn.sendMessage(from, { text: "*AUDIO DOWNLOAD HO RAHA HAI... THORA SA INTIZAR KARE ☺️*" });
  } catch (e) {
    console.log("Could not send waiting msg:", e.message);
  }

  // call API (increase timeout a bit)
  const apiUrl = `https://api.nekolabs.my.id/downloader/youtube/play/v1?q=${encodeURIComponent(q)}`;
  const { data } = await axios.get(apiUrl, { headers: { accept: "*/*" }, timeout: 60000 });

  // basic validation of response
  if (!data || !data.status || !data.data || !data.data.url) {
    if (keyForReact) await conn.sendMessage(from, { react: { text: "😔", key: keyForReact } });
    if (waitingMsg && waitingMsg.key) {
      try { await conn.sendMessage(from, { delete: waitingMsg.key }); } catch (e) { /* ignore */ }
    }
    return reply("*APKA AUDIO MUJHE NAHI MILA 🥺 AP APNA AUDIO DUBARA DOWNLOAD KARO ☺️*");
  }

  const { title, thumbnail, channel, views, likes, duration, url: downloadUrl } = data.data;

  // thumbnail/info caption
  const thumbCaption = `*__________________________________*\n*👑 AUDIO KA NAME 👑*\n *${title || "Unknown"}*\n*__________________________________*\n*👑 CHANNEL :❯ ${channel || 'Unknown'}*\n*__________________________________*\n*👑 VIEWS:❯ ${views || '—'}*\n*__________________________________*\n*👑 LIKES :❯ ${likes || '—'}*\n*__________________________________*\n*👑 TIME:❯ ${duration || '—'}*\n*__________________________________*`;

  // send thumbnail message (quoted)
  let thumbMsg = null;
  try {
    thumbMsg = await conn.sendMessage(from, { image: { url: thumbnail }, caption: thumbCaption }, { quoted: m });
  } catch (e) {
    console.log("Thumbnail send failed:", e.message);
  }

  // ---- fetch audio as buffer (more reliable than passing remote URL) ----
  let audioBuffer = null;
  try {
    const audioResp = await axios.get(downloadUrl, { responseType: "arraybuffer", timeout: 120000 });
    audioBuffer = Buffer.from(audioResp.data);
  } catch (e) {
    console.log("Failed to download audio buffer:", e.message);
    // if buffer fail, try sending remote URL fallback
  }

  try {
    const safeFileName = (title || "audio").replace(/[\\/:*?"<>|]/g, '') + ".mp3";

    if (audioBuffer && audioBuffer.length > 0) {
      await conn.sendMessage(from, {
        audio: audioBuffer,
        mimetype: "audio/mpeg",
        fileName: safeFileName,
        ptt: false
      }, { quoted: m });
    } else {
      // fallback: try sending remote url (some libs accept it)
      await conn.sendMessage(from, {
        audio: { url: downloadUrl },
        mimetype: "audio/mpeg",
        fileName: safeFileName,
        ptt: false
      }, { quoted: m });
    }

    // final caption (separate message)
    const finalCaption = `*_________________________________________*\n*👑 AUDIO KA NAME 👑* \n*${title || "Unknown"}*\n*_________________________________________*\n*MENE APKA AUDIO DOWNLOAD KAR DIA HAI OK ☺️ OR KOI AUDIO CHAHYE TO MUJHE BATANA 😍 KAR DE GE DOWNLOAD KOI MASLA NAHI BEE HAPPY DEAR 🥰💞*\n*_________________________________________*\n*👑 BY :❯ BILAL-MD 👑*\n*_________________________________________*`;
    let captionMsg = null;
    try {
      captionMsg = await conn.sendMessage(from, { text: finalCaption }, { quoted: m });
    } catch (e) {
      console.log("Final caption send failed:", e.message);
    }

    // delete waiting message safely
    if (waitingMsg && waitingMsg.key) {
      try { await conn.sendMessage(from, { delete: waitingMsg.key }); } catch (e) { /* ignore */ }
    }

    if (keyForReact) await conn.sendMessage(from, { react: { text: "🥰", key: keyForReact } });

  } catch (err) {
    console.error("ERROR sending audio:", err);
    if (keyForReact) await conn.sendMessage(from, { react: { text: "😔", key: keyForReact } });
    await reply("*ERROR: AUDIO SEND KARNE ME PROBLEM A GAYI 🥺 DUBARA TRY KARO ☹️*");
    // try to delete waiting msg
    if (waitingMsg && waitingMsg.key) {
      try { await conn.sendMessage(from, { delete: waitingMsg.key }); } catch (e) { /* ignore */ }
    }
  }

} catch (outerErr) {
  console.error("Unexpected error in audio command:", outerErr);
  try { if ((m && m.key)) await conn.sendMessage(from, { react: { text: "😔", key: m.key } }); } catch(e){}
  await reply("*KUCH GHALAT HO GAYA, DUBARA KOSHISH KARE 🥺*");
}
