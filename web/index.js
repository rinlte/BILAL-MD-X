const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");

const app = express();
const PORT = process.env.PORT || 8000;

app.use(bodyParser.json());
app.use(express.static(__dirname));

// serve the page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "page.html"));
});

// handle deploy (with live log streaming)
app.post("/deploy", async (req, res) => {
  const session = req.body.session;
  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.setHeader("Transfer-Encoding", "chunked");

  if (!session) {
    res.write("❌ No session provided!\n");
    return res.end();
  }

  const configPath = path.join(__dirname, "../config.js");
  try {
    let data = fs.readFileSync(configPath, "utf8");
    data = data.replace(/SESSION_ID:\s*".*?"/, `SESSION_ID: "${session}"`);
    fs.writeFileSync(configPath, data, "utf8");
    res.write("✅ Session ID saved to config.js\n");
  } catch (err) {
    res.write("❌ Failed to update config.js\n");
    return res.end();
  }

  res.write("🚀 Starting Heroku deployment...\n");

  const deploy = spawn("git", ["push", "heroku", "main"], { cwd: path.join(__dirname, "..") });

  deploy.stdout.on("data", (data) => res.write(data.toString()));
  deploy.stderr.on("data", (data) => res.write(data.toString()));

  deploy.on("close", (code) => {
    res.write(`\n✅ Deployment finished with code: ${code}\n`);
    res.end();
  });
});

app.listen(PORT, () => console.log(`✅ Auto deployer running on port ${PORT}`));
