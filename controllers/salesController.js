const Sales = require('../models/salesModel');

exports.getAllSales = async (req, res, next) => {
  const sales = await Sales.getAllSales();
  console.log(sales);
  res.status(200).json({
    status: 'success',
    results: sales.length,
    data: {
      sales,
    },
  });
};
