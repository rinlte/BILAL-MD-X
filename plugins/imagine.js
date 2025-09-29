const { cmd } = require("../command");
const axios = require("axios");
const fs = require("fs");

cmd({
  pattern: "imagine",
  alias: ["flux", "imagine"],
  react: "🖼️",
  desc: "Generate an image using AI.",
  category: "main",
  filename: __filename
}, async (conn, mek, m, { q, reply }) => {
  try {
    if (!q) return reply("*APKO KON C PHOTOS CHAHYE TO ESE LIKHE ☺️♥️ \n *IMAGINE FLOWERS*");

    await reply("_APKI PICS DOWNLOAD HO RAHI HAI THORA SA INTAZAR KARE...😊🌹_");

    const apiUrl = `https://api.siputzx.my.id/api/ai/flux?prompt=${encodeURIComponent(q)}`;

    const response = await axios.get(apiUrl, { responseType: "arraybuffer" });

    if (!response || !response.data) {
      return reply("*APKI PHOTO NAHI MILI SORRY 😔*");
    }

    const imageBuffer = Buffer.from(response.data, "binary");

    await conn.sendMessage(m.chat, {
      image: imageBuffer,
      caption: `*APKI PHOTO :❯* *${q}*`
    });

  } catch (error) {
    console.error("FluxAI Error:", error);
    reply(`An error occurred: ${error.response?.data?.message || error.message || "Unknown error"}`);
  }
});

cmd({
  pattern: "pic",
  alias: ["sdiffusion", "imagrt"],
  react: "🖼️",
  desc: "Generate an image using AI.",
  category: "main",
  filename: __filename
}, async (conn, mek, m, { q, reply }) => {
  try {
    if (!q) return reply("*APKO KOI PHOTO CHAHYE TONUSKA NAME LIKHO* \n *IMAGINE2 PAKISTANI FLAG*");

    await reply("_APKI PHOTOS BAS THORI DER ME AA JAYE GE...☺️🌹_");

    const apiUrl = `https://api.siputzx.my.id/api/ai/stable-diffusion?prompt=${encodeURIComponent(q)}`;

    const response = await axios.get(apiUrl, { responseType: "arraybuffer" });

    if (!response || !response.data) {
      return reply("*APKI PHOTO NAHI MIL RAHI SORRY 😔*");
    }

    const imageBuffer = Buffer.from(response.data, "binary");

    await conn.sendMessage(m.chat, {
      image: imageBuffer,
      caption: `*APKI PHOTO :❯ *${q}*`
    });

  } catch (error) {
    console.error("Error:", error);
    reply(`An error occurred: ${error.response?.data?.message || error.message || "Unknown error"}`);
  }
});

cmd({
  pattern: "photo",
  alias: ["stability", "imagi"],
  react: "🖼️",
  desc: "Generate an image using AI.",
  category: "main",
  filename: __filename
}, async (conn, mek, m, { q, reply }) => {
  try {
    if (!q) return reply("*APKO KISI CHIZ KI PHOTO CHAHYE TO ESE LIKH*O \n *IMAGINE3 SKY PHOTOS");

    await reply("_APKI PHOTO DOWNLOAD HO RAHI HAI....☺️_");

    const apiUrl = `https://api.siputzx.my.id/api/ai/stabilityai?prompt=${encodeURIComponent(q)}`;

    const response = await axios.get(apiUrl, { responseType: "arraybuffer" });

    if (!response || !response.data) {
      return reply("*APKI PHOTO MENE DHUNDI BAHUT LEKIN NAHI MILI SORRY 😔*");
    }

    const imageBuffer = Buffer.from(response.data, "binary");

    await conn.sendMessage(m.chat, {
      image: imageBuffer,
      caption: `APKI PHOTO:❯ *${q}*`
    });

  } catch (error) {
    console.error("Error:", error);
    reply(`An error occurred: ${error.response?.data?.message || error.message || "Unknown error"}`);
  }
});
