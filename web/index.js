const express = require("express");
const bodyParser = require("body-parser");
const { spawn } = require("child_process");

const app = express();
const PORT = process.env.PORT || 8000;

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send(`
  <html>
    <head>
      <title>BILAL-MD AUTO DEPLOY</title>
      <style>
        body {
          background: black;
          color: white;
          text-align: center;
          margin-top: 100px;
          font-family: Arial;
        }
        input {
          width: 300px; padding: 10px;
          border-radius: 5px; border: none; outline: none;
        }
        button {
          margin-top: 20px; padding: 10px 20px;
          border: none; border-radius: 5px;
          background: limegreen; color: black;
          font-weight: bold; cursor: pointer;
        }
      </style>
    </head>
    <body>
      <h1>🚀 BILAL-MD AUTO DEPLOY</h1>
      <form action="/deploy" method="POST">
        <input name="session" placeholder="Enter SESSION ID" required />
        <br>
        <button type="submit">Deploy Bot</button>
      </form>
    </body>
  </html>
  `);
});

app.post("/deploy", (req, res) => {
  const session = req.body.session;
  if (!session) return res.send("❌ Please enter a valid Session ID!");

  spawn("node", ["../index.js"], {
    env: { ...process.env, SESSION_ID: session },
    stdio: "inherit",
  });

  res.send("✅ Bot deployed successfully!");
});

app.listen(PORT, () => console.log(`✅ Auto deployer running on port ${PORT}`));
