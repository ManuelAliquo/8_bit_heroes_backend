const express = require("express");
const router = express.Router();

const checkoutController = require("../controllers/checkoutController");

// checkout
router.get("/checkout", checkoutController.orderProductindex);

module.exports = router;
