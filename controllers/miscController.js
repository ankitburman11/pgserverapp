const factory = require('./handlerFactory');

exports.createMaterial = factory.createOne('material_rate');
exports.getAllMaterial = factory.getAll('material_rate');
