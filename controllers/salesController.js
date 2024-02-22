const factory = require('./handlerFactory');

exports.getAllSales = factory.getAll('sales');
exports.getSale = factory.getOne('sales');
