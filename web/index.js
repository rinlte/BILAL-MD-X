const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");

const app = express();
const PORT = process.env.PORT || 8000;

app.use(bodyParser.urlencoded({ extended: true }));

// serve the page.html file
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "page.html"));
});

// handle form submission
app.post("/deploy", (req, res) => {
  const session = req.body.session;
  if (!session) return res.send("❌ Please enter a valid Session ID!");

  // update config.js
  const configPath = path.join(__dirname, "../config.js");
  let data = fs.readFileSync(configPath, "utf8");

  // replace SESSION_ID value
  data = data.replace(/SESSION_ID:\s*".*?"/, `SESSION_ID: "${session}"`);
  fs.writeFileSync(configPath, data, "utf8");

  // start bot
  spawn("node", ["../index.js"], { stdio: "inherit" });

  res.send("✅ Bot deployed successfully! Config updated with new Session ID.");
});

// start server
app.listen(PORT, () => console.log(`✅ Auto deployer running on port ${PORT}`));
