const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();

router.get("/healthz", (req, res) => {
  const ok = mongoose.connection.readyState === 1;
  res.status(200).json({ ok });
});

module.exports = router;
