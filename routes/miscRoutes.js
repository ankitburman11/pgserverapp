const express = require('express');
const miscController = require('../controllers/miscController');

const router = express.Router();

router
  .route('/')
  .get(miscController.getAllMaterial)
  .post(miscController.createMaterial);

module.exports = router;
