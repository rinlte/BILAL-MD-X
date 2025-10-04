const { cmd } = require("../command");
const { git, updateHerokuApp } = require("../lib/scraper");  // ✅ scraper se use ho raha hai
const config = require("../config");

// ─── checkupdate ───
cmd({
  pattern: "checkupdate",
  desc: "Check repo commits & update",
  category: "tools",
}, async (m, conn, text) => {
  try {
    await git.fetch();
    let commits = await git.log(["main..origin/main"]);

    if (commits.total === 0) {
      return conn.sendMessage(
        m.chat,
        { text: `✅ ${config.BOT_NAME || "BILAL-MD"} is already on latest version!` },
        { quoted: m }
      );
    }

    let update = commits.all.map(c => `- ${c.message}`).join("\n");
    await conn.sendMessage(
      m.chat,
      { text: `*⚡ Pending Updates:*\n${update}` },
      { quoted: m }
    );

    if (text === "start" && process.env.HEROKU_APP_NAME && process.env.HEROKU_API_KEY) {
      await conn.sendMessage(m.chat, { text: "⏳ Build started..." }, { quoted: m });
      const result = await updateHerokuApp();
      return conn.sendMessage(m.chat, { text: result }, { quoted: m });
    }
  } catch (e) {
    return conn.sendMessage(
      m.chat,
      { text: `❌ Error while checking update!\n${e}` },
      { quoted: m }
    );
  }
});

// ─── update ───
cmd({
  pattern: "update",
  desc: "Update repo locally (git pull)",
  category: "tools",
}, async (m, conn) => {
  try {
    await git.fetch();
    let commits = await git.log(["main..origin/main"]);

    if (commits.total === 0) {
      return conn.sendMessage(
        m.chat,
        { text: `✅ ${config.BOT_NAME || "BILAL-MD"} is already on latest version!` },
        { quoted: m }
      );
    }

    await git.reset("hard", ["HEAD"]);
    await git.pull();

    return conn.sendMessage(
      m.chat,
      { text: "✅ Repo updated successfully! Restart bot to apply changes." },
      { quoted: m }
    );
  } catch (e) {
    return conn.sendMessage(
      m.chat,
      { text: `❌ Error while updating!\n${e}` },
      { quoted: m }
    );
  }
});
