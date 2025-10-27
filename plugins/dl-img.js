const { cmd } = require("../command");
const axios = require("axios");

cmd({
    pattern: "img",
    alias: ["image", "googleimage", "searchimg", "pic", "photo", "pics", "imgs", "photos"],
    react: "🥺",
    desc: "Search and download Google images",
    category: "fun",
    use: ".img <keywords>",
    filename: __filename
}, async (conn, mek, m, { reply, args, from }) => {
    try {
        const query = args.join(" ");

        // ✅ No query condition
        if (!query) {
            await conn.sendMessage(from, { react: { text: "🥺", key: mek.key } });
            return reply(
                "*AP NE KOI PHOTOS DOWNLOAD KARNI HAI 🥺*\n" +
                "*TO AP ESE LIKHO ☺️*\n\n" +
                "*IMG ❮PHOTOS KA NAME❯*\n\n" +
                "*TO APKI PHOTO DOWNLOAD KAR KE 😇 YAHA PER BHEJ DE JAYE GE 🥰❤️*"
            );
        }

        await conn.sendMessage(from, { react: { text: "⏳", key: mek.key } });
        await reply(`*APKI PHOTOS DOWNLOAD HO RAHI HAI ☺️ THORA SA INTAZAR KARE...🌹*`);

        // 🔍 API request
        const url = `https://api.id.dexter.it.com/search/google/image?q=${encodeURIComponent(query)}`;
        const response = await axios.get(url);

        // ❌ Invalid / no data
        if (
            !response.data?.success ||
            !response.data.result?.result?.search_data?.length
        ) {
            await conn.sendMessage(from, { react: { text: "😥", key: mek.key } });
            return reply("*APKI PHOTOS NAHI MILI 😥*");
        }

        // ✅ Success: Random 15 images
        await conn.sendMessage(from, { react: { text: "☺️", key: mek.key } });
        const results = response.data.result.result.search_data;
        const selectedImages = results
            .sort(() => 0.5 - Math.random())
            .slice(0, 15);

        for (const imageUrl of selectedImages) {
            await conn.sendMessage(
                from,
                {
                    image: { url: imageUrl },
                    caption: `*👑 BY :❯ BILAL-MD 👑*`
                },
                { quoted: mek }
            );
            await new Promise(resolve => setTimeout(resolve, 1000)); // delay for spam control
        }

        await conn.sendMessage(from, { react: { text: "☹️", key: mek.key } });

    } catch (error) {
        console.error("IMG COMMAND ERROR:", error);
        await conn.sendMessage(from, { react: { text: "😔", key: mek.key } });
        reply(`❌ *Error:* ${error.message || "IMG COMMAND ERROR 🥺"}`);
    }
});
