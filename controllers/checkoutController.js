// db connection
const connection = require("../db/connection");

function index(req, res) {
  res.json({ message: "checkout router ok" });
}

module.exports = { index };
