const fetch = require("node-fetch");
const { cmd } = require("../command");

cmd({
  pattern: "spotifysearch",
  alias: ["spotifysrch", "spsearch"],
  desc: "Search for Spotify tracks or get album tracklist.",
  react: '✅',
  category: 'tools',
  filename: __filename
}, async (conn, m, store, { from, args, reply }) => {
  if (!args[0]) {
    return reply("🌸 What do you want to search on Spotify?\n\n*Usage Example:*\n.spotifysearch <query or album link>");
  }

  const query = args.join(" ");
  await store.react('⌛');

  try {
    // 🎧 If user provides a Spotify album link
    if (query.includes("spotify.com/album")) {
      reply("🎶 *Fetching Spotify album tracklist... Please wait!*");

      const albumApi = `https://apis-starlights-team.koyeb.app/starlight/spotify-albums-list?url=${encodeURIComponent(query)}`;
      const res = await fetch(albumApi);
      const data = await res.json();

      if (!data || !data.status || !data.result || data.result.length === 0) {
        await store.react('❌');
        return reply("❌ No album details found. Please check the link and try again.");
      }

      const albumInfo = data.album || {};
      const tracks = data.result;

      let albumMessage = `🎧 *Spotify Album Found!*\n\n`
        + `*• Album:* ${albumInfo.name || "Unknown"}\n`
        + `*• Artist:* ${albumInfo.artist || "Unknown"}\n`
        + `*• Total Tracks:* ${tracks.length}\n`
        + `*• Release Date:* ${albumInfo.release_date || "N/A"}\n`
        + `*• URL:* ${query}\n\n`
        + `🎵 *Track List:* \n`;

      tracks.slice(0, 10).forEach((t, i) => {
        albumMessage += `${i + 1}. ${t.title} - ${t.artist}\n`;
      });

      if (tracks.length > 10) albumMessage += `\n...and ${tracks.length - 10} more tracks 🎧`;

      await conn.sendMessage(from, {
        image: { url: albumInfo.image },
        caption: albumMessage
      }, { quoted: m });

      return await store.react('✅');
    }

    // 🔍 Otherwise: normal Spotify search query
    reply(`🔎 Searching Spotify for: *${query}*`);

    const searchUrl = `https://apis-keith.vercel.app/search/spotify?q=${encodeURIComponent(query)}`;
    const response = await fetch(searchUrl);
    const data = await response.json();

    if (!data || !data.status || !data.result || data.result.length === 0) {
      await store.react('❌');
      return reply("❌ No results found for your query. Please try a different keyword.");
    }

    const results = data.result.slice(0, 7).sort(() => Math.random() - 0.5);

    for (const track of results) {
      const message = `🎶 *Spotify Track Result*:\n\n`
        + `*• Title:* ${track.title}\n`
        + `*• Artist:* ${track.artist}\n`
        + `*• Album:* ${track.album}\n`
        + `*• Duration:* ${track.duration.formatted}\n`
        + `*• Release Date:* ${track.releaseDate}\n`
        + `*• URL:* ${track.url}\n`;

      reply(message);
    }

    await store.react('✅');

  } catch (error) {
    console.error("Error in SpotifySearch command:", error);
    await store.react('❌');
    reply("❌ An error occurred while processing your Spotify request. Please try again later.");
  }
});
