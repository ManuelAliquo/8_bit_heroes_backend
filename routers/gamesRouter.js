const express = require("express");
const router = express.Router();
const homepageController = require("../controllers/homepageController");
const gameController = require("../controllers/gameController");

router.get("/", (req, res) => {
  res.json({ message: "games router ok" });
});

/* HOMEPAGE CONTROLLERS */
router.get("/products/discounted", homepageController.discountedIndex);
router.get("/products/sales", homepageController.salesIndex);
router.post("/newsletter", homepageController.newsletterStore);

module.exports = router;
