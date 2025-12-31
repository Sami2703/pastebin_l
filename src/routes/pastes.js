const express = require("express");
const { nanoid } = require("nanoid");
const Paste = require("../models/Paste");
const getNow = require("../utils/time");

const router = express.Router();

/* Create paste */
router.post("/", async (req, res) => {
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

  const now = getNow(req);

  const paste = await Paste.create({
    pasteId: nanoid(10),
    content,
    expiresAt: ttl_seconds ? new Date(now.getTime() + ttl_seconds * 1000) : null,
    maxViews: max_views ?? null
  });

  res.status(201).json({
    id: paste.pasteId,
    url: `${req.protocol}://${req.get("host")}/p/${paste.pasteId}`
  });
});

/* Fetch paste */
router.get("/:id", async (req, res) => {
  const paste = await Paste.findOne({ pasteId: req.params.id });
  if (!paste) return res.status(404).json({ error: "Not found" });

  const now = getNow(req);

  // if (paste.expiresAt && now > paste.expiresAt)
  //   return res.status(404).json({ error: "Expired" });

  // if (paste.maxViews && paste.views >= paste.maxViews)
  //   return res.status(404).json({ error: "View limit exceeded" });

  const remainingViews =
  paste.maxViews !== null
    ? paste.maxViews - paste.views - 1
    : null;

  paste.views += 1;
  await paste.save();

  res.json({
    content: paste.content,
    remaining_views: remainingViews < 0 ? 0 : remainingViews,
    expires_at: paste.expiresAt
  });
});

module.exports = router;
