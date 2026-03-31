const express = require('express');
const router = express.Router();
const ordersController = require('../controllers/ordersController');

router.get("/:id", ordersController.show);
router.post("/", ordersController.store)


module.exports = router;