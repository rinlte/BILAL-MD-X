const express = require("express");
const bodyParser = require("body-parser");
const fetch = require("node-fetch");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 8000;

app.use(bodyParser.json());
app.use(express.static(__dirname));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "page.html"));
});

app.post("/deploy", async (req, res) => {
  const { session, token, repo } = req.body;
  if (!session || !token || !repo)
    return res.send("❌ Missing fields! Please fill all boxes.");

  try {
    const url = `https://api.github.com/repos/${repo}/contents/config.js`;
    const current = await fetch(url, {
      headers: { Authorization: `token ${token}` },
    }).then((r) => r.json());

    if (!current.content)
      return res.send("❌ config.js not found in the repository!");

    const decoded = Buffer.from(current.content, "base64").toString("utf8");
    const updated = decoded.replace(
      /SESSION_ID\s*[:=]\s*["'].*?["']/,
      `SESSION_ID = "${session}"`
    );
    const encoded = Buffer.from(updated).toString("base64");

    const result = await fetch(url, {
      method: "PUT",
      headers: {
        Authorization: `token ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: "Auto update SESSION_ID via BILAL-MD Web Deployer",
        content: encoded,
        sha: current.sha,
      }),
    }).then((r) => r.json());

    if (result.commit) {
      res.send(
        `✅ <b>Session updated on GitHub!</b><br>🗂 Repo: ${repo}<br>🚀 Heroku auto redeploy in 1–2 minutes...`
      );
    } else {
      res.send("❌ Commit failed! Please check your GitHub token or repo access.");
    }
  } catch (e) {
    res.send("⚠️ Error: " + e.message);
  }
});

app.listen(PORT, () => {
  console.log("✅ Auto deployer running on port " + PORT);
});
