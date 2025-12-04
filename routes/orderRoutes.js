const express = require('express');
const orderController = require('../controllers/orderController');
const commonController = require('../controllers/commonController');

const router = express.Router();

router
  .route('/')
  .get(orderController.getAllOrders)
  .patch(
    commonController.removeNonColumnProps,
    orderController.updateOrders,
    orderController.getOrder,
  );

router.route('/:id').delete(orderController.deleteOrder);

module.exports = router;
