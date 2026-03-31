const express = require("express");
const router = express.Router();

const gameController = require("../controllers/gameController");
const checkoutController = require("../controllers/checkoutController");

// checkout
router.get("/checkout", checkoutController.index);

module.exports = router;
