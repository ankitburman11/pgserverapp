const express = require('express');
const miscController = require('../controllers/miscController');

const router = express.Router();

router
  .route('/')
  .get(miscController.getAllMaterial)
  .patch(miscController.updateMaterial, miscController.getAllMaterial);

module.exports = router;
