const factory = require('./handlerFactory');

exports.getAllProducts = factory.getAll('products', [
  {
    joinTable: 'material_rate',
    mainTable: 'products',
    cols: [{ primary: 'material_id', foreign: 'id' }],
    join: 'join',
    selectCols: [{ col: 'name', alias: 'material' }],
  },
]);
exports.getProduct = factory.getOne('products', [
  {
    joinTable: 'material_rate',
    mainTable: 'products',
    cols: [{ primary: 'material_id', foreign: 'id' }],
    join: 'join',
    selectCols: [{ col: 'name', alias: 'material' }],
  },
]);
exports.createProduct = factory.createOne('products');
exports.updateProducts = factory.upsertMany('products');
exports.deleteProduct = factory.deleteMany('products');
