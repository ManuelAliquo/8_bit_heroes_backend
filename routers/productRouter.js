const express = require("express")
const router = express.Router()
const { show } = require("../controllers/productController")

router.get("/:id", show)

module.exports = router