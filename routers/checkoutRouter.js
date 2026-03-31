const express = require("express");
const router = express.Router();

const checkoutController = require("../controllers/checkoutController");

router.get("/checkout", checkoutController.orderProductindex);

router.patch("/checkout/order-update", checkoutController.updateOrderData);

module.exports = router;
