const factory = require('./handlerFactory');

exports.getAllProducts = factory.getAll('products');
exports.createProduct = factory.createOne('products');
exports.updateProducts = factory.upsertMany('products');
exports.deleteProduct = factory.deleteMany('products');
