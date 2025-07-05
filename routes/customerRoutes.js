const express = require('express');
const customerController = require('../controllers/customerController');
const commonController = require('../controllers/commonController');

const router = express.Router();

router
  .route('/')
  .get(customerController.getAllCustomers)
  .patch(
    commonController.removeNonColumnProps,
    customerController.updateCustomers,
    customerController.getCustomer,
  );

router.route('/:id').delete(customerController.deleteCustomer);
module.exports = router;
