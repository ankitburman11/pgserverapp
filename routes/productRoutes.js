const express = require('express');
const productsController = require('../controllers/productsController');

const router = express.Router();

router
  .route('/')
  .get(productsController.getAllProducts)
  .post(productsController.createProduct)
  .patch(productsController.updateProducts);

router.route('/:id').delete(productsController.deleteProduct);
module.exports = router;
