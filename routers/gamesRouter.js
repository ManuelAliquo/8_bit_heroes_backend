const express = require("express");
const router = express.Router();

// controller imports
const homepageController = require("../controllers/homepageController");
const sortingController = require("../controllers/sortingController");
const productController = require("../controllers/productController");
const checkoutController = require("../controllers/checkoutController");

/* HOMEPAGE CONTROLLER */
router.get("/products/discounted", homepageController.discountedIndex);
router.get("/products/sales", homepageController.salesIndex);
router.post("/newsletter", homepageController.newsletterStore);

/* SORTING CONTROLLER */
router.get("/products", sortingController.unsortedIndex);
router.get("/products/sort", sortingController.sortedIndex);

/* PRODUCT DETAIL CONTROLLER */
router.get("/product/:id", productController.show);

/* CHECKOUT CONTROLLER */
router.get("/checkout", checkoutController.orderProductindex);
router.patch("/checkout/order-update", checkoutController.updateOrderData);

module.exports = router;
