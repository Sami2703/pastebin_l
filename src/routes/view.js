const express = require("express");
const Paste = require("../models/Paste");
const getNow = require("../utils/time");

const router = express.Router();

router.get("/:id", async (req, res) => {
  const paste = await Paste.findOne({ pasteId: req.params.id });
  if (!paste) return res.sendStatus(404).send(`
  <html>
    <body>
      <h2>Paste not found or expired</h2>
    </body>
  </html>
`);

  const now = getNow(req);

  if(paste.expiresAt && now > paste.expiresAt)
    {
      return res.sendStatus(404);
    }
  if(paste.maxViews!== null && paste.views >= paste.maxViews)
    {
    return res.sendStatus(404);
  }

  // Calculate remaining views BEFORE increment
  const remainingViews =
    paste.maxViews !== null
      ? paste.maxViews - paste.views - 1
      : null;

  // Increment view count
  paste.views += 1;
  await paste.save();

  res.send(`
    <html>
      <head>
        <title>View Paste Page</title>
        <style>
          body { font-family: Arial; max-width: 700px; margin: 40px auto; }
          .meta { color: #555; margin-bottom: 10px; }
          pre { background: #f4f4f4; padding: 15px; }
        </style>
      </head>
      <body>
        <div class="meta">
          <strong>Remaining views:</strong>
          ${remainingViews !== null ? remainingViews : "Unlimited"}
        </div>

        <pre>${paste.content.replace(/</g, "&lt;")}</pre>
      </body>
    </html>
  `);
});

module.exports = router;
