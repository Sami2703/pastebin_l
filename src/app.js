require("dotenv").config();
const express = require("express");
const connectDB = require("./db");

const health = require("./routes/health");
const pastes = require("./routes/pastes");
const view = require("./routes/view");
const ui = require("./routes/Ui");


const app = express();

connectDB();

app.use(express.json());

app.use("/api", health);
app.use("/api/pastes", pastes);
app.use("/p", view);
app.use("/", ui);

module.exports = app;
