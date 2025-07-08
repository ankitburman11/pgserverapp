const express = require('express');
const productsController = require('../controllers/productsController');
const commonController = require('../controllers/commonController');

const router = express.Router();

router
  .route('/')
  .get(productsController.getAllProducts)
  // .post(productsController.createProduct)
  .patch(
    commonController.removeNonColumnProps,
    productsController.updateProducts,
    productsController.getProduct,
  );

router
  .route('/:id')
  // .get(productsController.getProduct)
  .delete(productsController.deleteProduct);
module.exports = router;
