const mongoose = require("mongoose");

const PasteSchema = new mongoose.Schema({
  pasteId: {
    type: String,
    required: true,
    unique: true
  },
  content: { type: String, required: true },
  language: {
    type: String,
    default: "text"
  },
  createdAt: { type: Date, default: Date.now, expires: "7d" },
  expiresAt: { type: Date, default: null },
  maxViews: { type: Number, default: null },
  views: { type: Number, default: 0 }
});

module.exports = mongoose.model("Paste", PasteSchema);
