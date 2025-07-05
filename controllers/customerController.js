const factory = require('./handlerFactory');
const catchAsync = require('../utils/catchAsync');

const customerModel = require('../models/customerModel');

exports.getAllCustomers = catchAsync(async (req, res, next) => {
  const rows = await customerModel.getAllCustomers();
  // SEND RESPONSE
  res.status(200).json({
    status: 'success',
    results: rows.length,
    data: {
      records: rows,
    },
  });
});

exports.getCustomer = catchAsync(async (req, res, next) => {
  const rows = await customerModel.getCustomer(req);
  // SEND RESPONSE
  res.status(200).json({
    status: 'success',
    results: rows.length,
    data: {
      records: rows,
    },
  });
});

exports.updateCustomers = factory.upsertMany('customers');
exports.deleteCustomer = factory.deleteMany('customers');
