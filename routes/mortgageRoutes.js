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
  .route('/installments')
  .patch(
    mortgageController.updateMortgageInstallment,
    mortgageController.getMortgage,
  );

router
  .route('/installments/:id')
  .delete(mortgageController.deleteMortgageInstallment);

router
  .route('/:id')
  .get(mortgageController.getMortgage)
  .delete(mortgageController.deleteMortgage);
module.exports = router;
