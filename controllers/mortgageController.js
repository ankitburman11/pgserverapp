const factory = require('./handlerFactory');

exports.createMortgage = factory.createOne('mortgages');

exports.getMortgages = factory.getAll(
  'mortgages',
  [
    {
      joinTable: 'products',
      mainTable: 'mortgages',
      cols: [{ primary: 'product_id', foreign: 'id' }],
      join: 'join',
      selectCols: [{ col: 'name', alias: 'product_name' }],
    },
    {
      joinTable: 'customers',
      mainTable: 'mortgages',
      cols: [{ primary: 'customer_id', foreign: 'id' }],
      join: 'join',
      selectCols: [{ col: 'name', alias: 'customer_name' }],
    },
  ],
  [
    'id',
    'roi',
    'amount',
    'product_id',
    'customer_id',
    'item_weight',
    'item_value',
    'item_rate',
    'start_date',
    'expect_end_date',
    'notes',
    'created_at',
    'created_by',
    'updated_at',
    'updated_by',
  ],
);
exports.getMortgage = factory.getOne(
  'mortgages',
  [
    {
      joinTable: 'products',
      mainTable: 'mortgages',
      cols: [{ primary: 'product_id', foreign: 'id' }],
      join: 'join',
      selectCols: [{ col: 'name', alias: 'product_name' }],
    },
    {
      joinTable: 'customers',
      mainTable: 'mortgages',
      cols: [{ primary: 'customer_id', foreign: 'id' }],
      join: 'join',
      selectCols: [{ col: 'name', alias: 'customer_name' }],
    },
  ],
  [
    'id',
    'roi',
    'amount',
    'product_id',
    'customer_id',
    'item_weight',
    'item_value',
    'item_rate',
    'start_date',
    'expect_end_date',
    'notes',
    'created_at',
    'created_by',
    'updated_at',
    'updated_by',
  ],
);

exports.updateMortgage = factory.upsertMany('mortgages');
exports.deleteMortgage = factory.deleteMany('mortgages');
