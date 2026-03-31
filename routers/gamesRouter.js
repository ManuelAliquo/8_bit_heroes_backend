const express = require("express");
const router = express.Router();

const gameController = require("../controllers/gameController");

// checkout
router.get("/checkout", (req, res) => {
  res.json({ message: "checkout router ok" });
});

module.exports = router;
