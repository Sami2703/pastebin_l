const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.send(`
    <html>
      <head>
        <title>Pastebin Lite</title>
        <style>
          body { font-family: Arial; max-width: 600px; margin: 40px auto; }
          textarea { width: 100%; height: 150px; }
          input, button { margin-top: 10px; width: 100%; padding: 8px; }
          .error { color: red; }
          .success { color: green; }
        </style>
      </head>
      <body>
        <h2>Create a Paste</h2>

        <form id="pasteForm">
          <textarea id="content" placeholder="Enter your text..." required></textarea>

          <input id="ttl" type="number" placeholder="TTL in seconds (optional)" min="1" />
          <input id="views" type="number" placeholder="Max views (optional)" min="1" />

          <button type="submit">Create Paste</button>
        </form>

        <p id="message"></p>

        <script>
          const form = document.getElementById("pasteForm");
          const msg = document.getElementById("message");

          form.onsubmit = async (e) => {
            e.preventDefault();
            msg.textContent = "";

            const body = {
              content: document.getElementById("content").value
            };

            const ttl = document.getElementById("ttl").value;
            const views = document.getElementById("views").value;

            if (ttl) body.ttl_seconds = Number(ttl);
            if (views) body.max_views = Number(views);

            const res = await fetch("/api/pastes", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(body)
            });

            const data = await res.json();

            if (!res.ok) {
              msg.innerHTML = "<span class='error'>" + data.error + "</span>";
              return;
            }

            msg.innerHTML =
              "<span class='success'>Paste created:</span><br>" +
              "<a href='" + data.url + "' target='_blank'>" + data.url + "</a>";
          };
        </script>
      </body>
    </html>
  `);
});

module.exports = router;
