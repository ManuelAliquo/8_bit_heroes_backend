const express = require("express");
const router = express.Router();

const gameController = require("../controllers/gameController");

router.get("/", (req, res) => {
  res.json({ message: "games router ok" })
})

module.exports = router;
