const factory = require('./handlerFactory');

exports.updateMaterial = factory.upsertMany('material_rate');
exports.getAllMaterial = factory.getAll('material_rate');
