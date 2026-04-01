const express = require("express");
const router = express.Router();
const homepageController = require("../controllers/homepageController");
const gameController = require("../controllers/gameController");
const sortingController = require("../controllers/sortingController");
const productController = require("../controllers/productController");
const checkoutController = require("../controllers/checkoutController");

router.get("/", (req, res) => {
  res.json({ message: "games router ok" });
});

/* HOMEPAGE CONTROLLER */
router.get("/products/discounted", homepageController.discountedIndex);
router.get("/products/sales", homepageController.salesIndex);
router.post("/newsletter", homepageController.newsletterStore);


/* SORTING CONTROLLER */
router.get("/products", sortingController.unsortedIndex);
router.get("/products/sort", sortingController.sortedIndex);

/* PRODUCT DETAIL */
router.get("/products/:slug", productController.show);

/* CHECKOUT CONTROLLER */
router.get("/checkout", checkoutController.orderProductindex);
router.patch("/checkout/order-update", checkoutController.updateOrderData);

module.exports = router;
