const express = require('express');
const router = express.Router();
const ordersController = require('../controllers/ordersController');
const ordersMiddlewares = require('../middlewares/ordersMiddlewares');

router.get('/', ordersController.index)
router.get("/:id",ordersMiddlewares.validId, ordersController.show);
router.post("/", ordersController.store)


module.exports = router;