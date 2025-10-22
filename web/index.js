const express = require("express");
const path = require("path");
const { spawn } = require("child_process");

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.post("/deploy", async (req, res) => {
  const { session } = req.body;
  if (!session) return res.status(400).send("⚠️ Session ID missing!");

  try {
    // Start bot process with session id passed as argument
    const bot = spawn("node", ["../index.js"], {
      env: { ...process.env, SESSION_ID: session },
      stdio: "inherit"
    });

    res.send("✅ BILAL-MD Bot deployed successfully!");
  } catch (err) {
    console.error(err);
    res.status(500).send("❌ Error deploying bot!");
  }
});

app.listen(8000, () =>
  console.log("🌐 BILAL-MD Auto-Deploy Server running at http://localhost:8000")
);
