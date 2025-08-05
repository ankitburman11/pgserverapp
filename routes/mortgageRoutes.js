const express = require('express');
const mortgageController = require('../controllers/mortgageController');
const commonController = require('../controllers/commonController');

const router = express.Router();

router
  .route('/')
  .get(mortgageController.getMortgages)
  // .post(mortgageController.createProduct)
  .patch(
    commonController.removeNonColumnProps,
    mortgageController.updateMortgage,
    mortgageController.getMortgage,
  );

router
  .route('/:id')
  // .get(mortgageController.getProduct)
  .delete(mortgageController.deleteMortgage);
module.exports = router;
