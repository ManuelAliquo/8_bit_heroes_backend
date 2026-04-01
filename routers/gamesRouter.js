const express = require("express");
const router = express.Router();

// controller imports
const homepageController = require("../controllers/homepageController");
const productController = require("../controllers/productController");
const checkoutController = require("../controllers/checkoutController");

/* HOMEPAGE CONTROLLERS */
router.get("/products/discounted", homepageController.discountedIndex);
router.get("/products/sales", homepageController.salesIndex);
router.post("/newsletter", homepageController.newsletterStore);


/* PRODUCT DETAIL */
router.get("/products/:slug", productController.show);

/* CHECKOUT CONTROLLERS */
router.get("/checkout", checkoutController.orderProductindex);
router.patch("/checkout/order-update", checkoutController.updateOrderData);

module.exports = router;
