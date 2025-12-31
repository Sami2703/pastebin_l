const express = require("express");
const { nanoid } = require("nanoid");
const Paste = require("../models/Paste");
const getNow = require("../utils/time");

const router = express.Router();

/* Create paste */
router.post("/", async (req, res) => {
  try {
    const { content, ttl_seconds, max_views } = req.body;

    if (!content || typeof content !== "string" || !content.trim()) {
      return res.status(400).json({ error: "Invalid content" });
    }

    if (ttl_seconds && (!Number.isInteger(ttl_seconds) || ttl_seconds < 1)) {
      return res.status(400).json({ error: "Invalid ttl_seconds" });
    }

    if (max_views && (!Number.isInteger(max_views) || max_views < 1)) {
      return res.status(400).json({ error: "Invalid max_views" });
    }

    const now = new Date();

    const paste = await Paste.create({
      pasteId: nanoid(10),
      content,
      expiresAt: ttl_seconds ? new Date(now.getTime() + ttl_seconds * 1000) : null,
      maxViews: max_views ?? null
    });

    const baseUrl = `https://${req.headers.host}`;

    res.status(201).json({
      id: paste.pasteId,
      url: `${baseUrl}/p/${paste.pasteId}`
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});


/* Fetch paste */
router.get("/:id", async (req, res) => {
  try {
    const paste = await Paste.findOne({ pasteId: req.params.id });
    if (!paste) return res.status(404).json({ error: "Not found" });

    paste.views += 1;
    await paste.save();

    res.json({
      content: paste.content,
      remaining_views:
        paste.maxViews !== null ? Math.max(0, paste.maxViews - paste.views) : null,
      expires_at: paste.expiresAt
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});


module.exports = router;
