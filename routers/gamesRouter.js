const express = require("express");
const router = express.Router();
const homepageController = require("../controllers/homepageController");
const sortingController = require("../controllers/sortingController");
const productController = require("../controllers/productController");
const ordersController = require("../controllers/ordersController");
const ordersMiddlewares = require("../middlewares/ordersMiddlewares");
const checkoutController = require("../controllers/checkoutController");
const newsletterMiddleware = require("../middlewares/newsletterMiddleware");

/* HOMEPAGE CONTROLLER */
router.get("/products/discounted", homepageController.discountedIndex);
router.get("/products/sales", homepageController.salesIndex);
router.post("/newsletter", newsletterMiddleware.validEmail, homepageController.newsletterStore);

/* SORTING CONTROLLER */
router.get("/products", sortingController.index);
router.get("/products/find", sortingController.searchQueryParam);

/* PRODUCT DETAIL CONTROLLER */
router.get("/products/:slug", productController.show);

/* ORDER CONTROLLER */
router.get("/orders", ordersController.index);
router.get("/orders/:id", ordersMiddlewares.validId, ordersController.show);
router.post("/orders", ordersMiddlewares.validData, ordersController.store);

/* CHECKOUT CONTROLLER */
router.get("/checkout", checkoutController.orderProductindex);

module.exports = router;
