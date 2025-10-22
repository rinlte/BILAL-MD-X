const fs = require("fs");
const path = require("path");

app.post("/deploy", (req, res) => {
  const session = req.body.session;

  if (!session) return res.send("❌ Please enter a valid Session ID!");

  // config.js ka exact path le lo
  const configPath = path.join(__dirname, "../config.js");

  // purani file read kar
  let data = fs.readFileSync(configPath, "utf8");

  // SESSION_ID line replace kar
  data = data.replace(/SESSION_ID:\s*".*?"/, `SESSION_ID: "${session}"`);

  // wapas likh de updated value
  fs.writeFileSync(configPath, data, "utf8");

  // ab bot ko start kar
  const child = spawn("node", ["../index.js"], {
    stdio: "inherit",
  });

  res.send("✅ Bot deployed successfully and session ID updated in config.js!");
});
