const factory = require('./handlerFactory');

exports.getAllOrders = factory.getAll('orders_vw');
exports.getOrder = factory.getOne('orders_vw');
exports.updateOrders = factory.upsertParentWithChildren(
  'orders',
  'order_item',
  'id',
  'order_id',
);
exports.deleteOrder = factory.deleteMany('orders');
