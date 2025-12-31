function getNow(req) {
  if (process.env.TEST_MODE === "1") {
    const ms = req.headers["x-test-now-ms"];
    if (ms) return new Date(Number(ms));
  }
  return new Date();
}

module.exports = getNow;
