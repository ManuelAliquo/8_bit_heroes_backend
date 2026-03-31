const express = require("express");
const router = express.Router();
const homepageController = require("../controllers/homepageController");
const gameController = require("../controllers/gameController");

router.get("/", (req, res) => {
  res.json({ message: "games router ok" });
});

/* HOMEPAGE CONTROLLERS */
router.get("/products", homepageController.index);
router.post("/newsletter", homepageController.store);

module.exports = router;
