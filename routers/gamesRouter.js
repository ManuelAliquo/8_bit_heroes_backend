const express = require("express");
const router = express.Router();

const homepageController = require("../controllers/homepageController");
const checkoutController = require("../controllers/checkoutController");

/* CHECKOUT CONTROLLERS */
router.get("/checkout", checkoutController.orderProductindex);
router.patch("/checkout/order-update", checkoutController.updateOrderData);

/* HOMEPAGE CONTROLLERS */
router.get("/products/discounted", homepageController.discountedIndex);
router.get("/products/sales", homepageController.salesIndex);
router.post("/newsletter", homepageController.newsletterStore);

module.exports = router;
