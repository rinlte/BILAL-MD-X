// -------------------------
// Command: .fb <url>
// -------------------------
cmd({
    pattern: "fb",
    alias: ["facebook", "fb1", "fb2", "fbdl", "fbvideo", "facebookvideo", "lite", "fvid", "fvide", "fvideo", "fbdlvideo"],
    desc: "Download Facebook videos",
    category: "downloader"
}, async (conn, mek, m, { args }) => {
    try {
        const url = args[0];
        if (!url) return conn.sendMessage(m.chat, { text: "*APKO FACEBOOK KI VIDEO DOWNLOAD KARNA HAI 🤔*\n*TOH AP AISE LIKHO ☺️🌹* \n\n *FB ❮APKI FACEBOOK VIDEO KA LINK❯* \n \n *TO APKI FACEBOOK VIDEO DOWNLOAD KAR KE YAHA BHEJ DE JAYE GE 🥰🌹*" }, { quoted: mek });
        if (!url.includes("facebook.com")) return conn.sendMessage(m.chat, { text: "⚠️ Invalid Facebook URL." }, { quoted: mek });

        // ✅ Pehle command/link message pe 🥺 react
        await conn.sendMessage(m.chat, { react: { text: "🥺", key: mek.key } });

        // Waiting message
        const waitMsg = await conn.sendMessage(m.chat, { text: "*APKI FACEBOOK VIDEO DOWNLOAD HO RAHI HAI....☺️🌹*" }, { quoted: mek });

        const fbvid = await downloadFacebookVideo(url);
        const filePath = await saveVideo(fbvid);

        // Send video
        await conn.sendMessage(m.chat, {
            video: { url: filePath },
            mimetype: "video/mp4",
            caption: "BY :❯ BILAL-MD"
        }, { quoted: mek });

        // ✅ Video sent → command/link message react update to ☺️
        try {
            // Delete previous react (not all libs support direct edit, so we just send new react)
            await conn.sendMessage(m.chat, { react: { text: "☺️", key: mek.key } });
        } catch(e){}

        // Delete waiting message
        await conn.sendMessage(m.chat, { delete: waitMsg.key });

        fs.unlinkSync(filePath);
    } catch (e) {
        console.error("ERROR :❯", e);
        conn.sendMessage(m.chat, { text: "APKI VIDEO NAHI MILI SORRY 🥺❤️." }, { quoted: mek });
    }
});

// -------------------------
// Auto Downloader (If only FB link is sent)
// -------------------------
cmd({
    on: "text"
}, async (conn, mek, m, { body }) => {
    try {
        if (!body.includes("facebook.com")) return;
        const url = body.match(/https?:\/\/[^\s]+/i)[0];
        if (!url) return;

        // ✅ Pehle command/link message pe 🥺 react
        await conn.sendMessage(m.chat, { react: { text: "🥺", key: mek.key } });

        // Waiting message
        const waitMsg = await conn.sendMessage(m.chat, { text: "*APKI FACEBOOK VIDEO DOWNLOAD HO RAHI HAI....☺️🌹*" }, { quoted: mek });

        const fbvid = await downloadFacebookVideo(url);
        const filePath = await saveVideo(fbvid);

        // Send video
        await conn.sendMessage(m.chat, {
            video: { url: filePath },
            mimetype: "video/mp4",
            caption: "BY :❯ BILAL-MD"
        }, { quoted: mek });

        // ✅ Video sent → command/link message react update to ☺️
        try {
            await conn.sendMessage(m.chat, { react: { text: "☺️", key: mek.key } });
        } catch(e){}

        // Delete waiting message
        await conn.sendMessage(m.chat, { delete: waitMsg.key });

        fs.unlinkSync(filePath);
    } catch (e) {
        console.error("FB AutoDL Error:", e);
        conn.sendMessage(m.chat, { text: "APKI VIDEO NAHI MILI SORRY 🥺❤️." }, { quoted: mek });
    }
});
