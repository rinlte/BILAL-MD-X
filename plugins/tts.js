const { cmd } = require("../command");
const googleTTS = require("google-tts-api");
const fs = require("fs");
const axios = require("axios");
const path = require("path");

cmd({
  pattern: "tts",
  desc: "Convert text to speech with different voices.",
  category: "fun",
  react: "😇",
  filename: __filename
},
async (conn, mek, m, { from, args, q, reply }) => {
  try {
    if (!q) return reply("❌ Please provide text for conversion!\nExample: `.tts hello world`");

    // Select voice / language
    let voiceLanguage = "en-US";
    if (args[0] === "female") voiceLanguage = "en-GB";
    else if (args[0] === "ur" || args[0] === "urdu") voiceLanguage = "ur";

    // Generate TTS URL
    const ttsUrl = googleTTS.getAudioUrl(q, {
      lang: voiceLanguage,
      slow: false,
      host: "https://translate.google.com",
    });

    // Download the audio file
    const outputPath = path.join(__dirname, "../temp_tts.mp3");
    const response = await axios({
      url: ttsUrl,
      method: "GET",
      responseType: "arraybuffer",
    });
    fs.writeFileSync(outputPath, response.data);

    // Send as voice message (PTT)
    await conn.sendMessage(from, {
      audio: fs.readFileSync(outputPath),
      mimetype: "audio/mpeg",
      ptt: true
    }, { quoted: mek });

    // Delete temp file
    fs.unlinkSync(outputPath);

  } catch (error) {
    console.error("TTS Error:", error);
    reply(`❌ Error generating speech: ${error.message}`);
  }
});


cmd({
  pattern: "tts2",
  desc: "Convert text to speech (Urdu or English).",
  category: "fun",
  react: "🔊",
  filename: __filename
},
async (conn, mek, m, { from, args, q, reply }) => {
  try {
    if (!q) return reply("❌ Please provide text!\nExample: `.tts2 ur Hello world`");

    // Detect language
    let voiceLanguage = "en-US";
    if (args[0] === "ur" || args[0] === "urdu") voiceLanguage = "ur";

    const ttsUrl = googleTTS.getAudioUrl(q, {
      lang: voiceLanguage,
      slow: false,
      host: "https://translate.google.com",
    });

    // Download and save
    const outputPath = path.join(__dirname, "../temp_tts2.mp3");
    const response = await axios({
      url: ttsUrl,
      method: "GET",
      responseType: "arraybuffer",
    });
    fs.writeFileSync(outputPath, response.data);

    // Send voice message
    await conn.sendMessage(from, {
      audio: fs.readFileSync(outputPath),
      mimetype: "audio/mpeg",
      ptt: true
    }, { quoted: mek });

    fs.unlinkSync(outputPath);

  } catch (error) {
    console.error("TTS2 Error:", error);
    reply(`❌ Error generating audio: ${error.message}`);
  }
});
