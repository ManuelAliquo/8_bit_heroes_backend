const express = require("express");
const router = express.Router();
const homepageController = require("../controllers/homepageController");
const sortingController = require("../controllers/sortingController");
const productController = require("../controllers/productController");
const ordersController = require("../controllers/ordersController");
const ordersMiddlewares = require("../middlewares/ordersMiddlewares");
const checkoutController = require("../controllers/checkoutController");
const searchController = require("../controllers/searchController");

/* HOMEPAGE CONTROLLER */
router.get("/products/discounted", homepageController.discountedIndex);
router.get("/products/sales", homepageController.salesIndex);
router.post("/newsletter", homepageController.newsletterStore);

/* SORTING CONTROLLER */
router.get("/products", sortingController.unsortedIndex);
router.get("/products/sort", sortingController.sortedIndex);

/* PRODUCT DETAIL CONTROLLER */
router.get("/products/:slug", productController.show);

/* ORDER CONTROLLER */
router.get("/orders", ordersController.index);
router.get("/orders/:id", ordersMiddlewares.validId, ordersController.show);
router.post("/orders", ordersController.store);

/* CHECKOUT CONTROLLER */
router.get("/checkout", checkoutController.orderProductindex);
router.patch("/checkout/order-update/:id", checkoutController.updateOrderData);

/* SEARCH CONTROLLER */
router.get("/search/products", searchController.index);

module.exports = router;
