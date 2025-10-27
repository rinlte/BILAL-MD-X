const { cmd } = require("../command");
const axios = require("axios");

cmd({
    pattern: "img",
    alias: ["image", "googleimage", "searchimg", "pic", "photo"],
    react: "🦋",
    desc: "Search and download Google images",
    category: "fun",
    use: ".img <keywords>",
    filename: __filename
}, async (conn, mek, m, { reply, args, from }) => {
    try {
        const query = args.join(" ");
        if (!query) {
            return reply("*AP NE KOI PHOTOS DOWNLOAD KARNI HAI 🥺* \n *TO AP ESE LIKHO ☺️* \\n\n *IMG ❮PHOTOS KA NAME❯* \n\n *TO APKI PHOTO DOWNLOAD KAR KE 😇 YAHA PER BHEJ DE JAYE GE 🥰❤️* ");
        }

        await reply(`🔍 Searching images for "${query}"...`);

        // Dexter API
        const url = `https://api.id.dexter.it.com/search/google/image?q=${encodeURIComponent(query)}`;
        const response = await axios.get(url);

        // Validate response
        if (
            !response.data?.success || 
            !response.data.result?.result?.search_data?.length
        ) {
            return reply("APKI PHOTOS NAHI MILI 😔*");
        }

        const results = response.data.result.result.search_data;
        // Random 5 images
        const selectedImages = results
            .sort(() => 0.5 - Math.random())
            .slice(0, 5);

        for (const imageUrl of selectedImages) {
            await conn.sendMessage(
                from,
                { 
                    image: { url: imageUrl },
                    caption: `*👑 BILAL-MD WHATSAPP BOT 👑*`
                },
                { quoted: mek }
            );
            // Delay to avoid spam
            await new Promise(resolve => setTimeout(resolve, 1000));
        }

    } catch (error) {
        console.error('*PHOTOS NAHI MILI 🥺*', error);
        reply(`❌ Error: ${error.message || "*IMG COMMAND ERROR 🥺*"}`);
    }
});
