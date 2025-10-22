const express = require("express");
const bodyParser = require("body-parser");
const fetch = require("node-fetch");
const app = express();

app.use(bodyParser.json());
app.use(express.static(__dirname));

const PORT = process.env.PORT || 8000;

app.get("/", (req, res) => res.sendFile(__dirname + "/page.html"));

app.post("/deploy", async (req, res) => {
  const { session, token, repo } = req.body;
  if (!session || !token || !repo) return res.send("❌ Missing fields!");

  try {
    const url = `https://api.github.com/repos/${repo}/contents/config.js`;
    const current = await fetch(url, {
      headers: { Authorization: `token ${token}` },
    }).then((r) => r.json());

    if (!current.content) return res.send("❌ config.js not found in repo!");

    const decoded = Buffer.from(current.content, "base64").toString("utf8");
    const updated = decoded.replace(
      /SESSION_ID:\s*".*?"/,
      `SESSION_ID: "${session}"`
    );
    const encoded = Buffer.from(updated).toString("base64");

    const result = await fetch(url, {
      method: "PUT",
      headers: {
        Authorization: `token ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: "Auto update SESSION_ID via web deployer",
        content: encoded,
        sha: current.sha,
      }),
    }).then((r) => r.json());

    if (result.commit) {
      res.send(
        `✅ Session updated on GitHub!\n🗂 Repo: ${repo}\n🚀 Heroku auto redeploy in 1–2 minutes...`
      );
    } else {
      res.send("❌ Commit failed! Check token or repo access.");
    }
  } catch (e) {
    res.send("⚠️ Error: " + e.message);
  }
});

app.listen(PORT, () => console.log("✅ Auto deployer running on port " + PORT));
