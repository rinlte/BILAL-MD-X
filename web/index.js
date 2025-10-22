// 🌐 BILAL-MD AUTO DEPLOYER
const express = require("express");
const path = require("path");
const fs = require("fs");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 8000;

// 🔧 middlewares
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname))); // serve static page.html

// 🏠 route to open page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "page.html"));
});

// 🚀 main deploy route
app.post("/deploy", async (req, res) => {
  const { session, token, owner } = req.body;

  // validation
  if (!session || !token || !owner)
    return res.send("❌ Missing fields! Please fill all boxes.");

  try {
    const configPath = path.join(__dirname, "../config.js");

    // check config exists
    if (!fs.existsSync(configPath)) {
      return res.send("⚠️ config.js not found in root folder!");
    }

    let configData = fs.readFileSync(configPath, "utf8");

    // replace SESSION_ID
    if (configData.match(/SESSION_ID\s*[:=]\s*["'].*?["']/)) {
      configData = configData.replace(
        /SESSION_ID\s*[:=]\s*["'].*?["']/,
        `SESSION_ID = "${session}"`
      );
    } else {
      configData += `\nSESSION_ID = "${session}";`;
    }

    // replace OWNER_NUMBER
    if (configData.match(/OWNER_NUMBER\s*[:=]\s*["'].*?["']/)) {
      configData = configData.replace(
        /OWNER_NUMBER\s*[:=]\s*["'].*?["']/,
        `OWNER_NUMBER = "${owner}"`
      );
    } else {
      configData += `\nOWNER_NUMBER = "${owner}";`;
    }

    // save updated config
    fs.writeFileSync(configPath, configData, "utf8");
    console.log("✅ Config updated successfully!");

    res.send(`
      ✅ <b>Deployment Successful!</b><br>
      🧩 Session ID: ${session}<br>
      👑 Owner Number: ${owner}<br>
      🔐 Token (saved securely): ${token.slice(0, 4)}********<br>
      🚀 Bot restarting on Heroku...
    `);
  } catch (err) {
    console.error(err);
    res.send("❌ Error while updating config.js: " + err.message);
  }
});

// 🟢 Start server
app.listen(PORT, () =>
  console.log(`✅ Web Deployer running on port ${PORT}`)
);
