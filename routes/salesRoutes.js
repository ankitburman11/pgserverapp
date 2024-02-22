const express = require('express');
const salesController = require('../controllers/salesController');

const router = express.Router();

router.route('/').get(salesController.getAllSales);
//   .post(salesController.addSale);
router.route('/:id').get(salesController.getSale);
// router.route('/:id').get(salesController.getSalesOfCustomer);

module.exports = router;
