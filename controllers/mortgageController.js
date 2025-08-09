const factory = require('./handlerFactory');

exports.getMortgages = factory.getAll('mortgages_vw');
exports.getMortgage = factory.getOne('mortgages_vw');

exports.updateMortgage = factory.upsertMany('mortgages');
exports.deleteMortgage = factory.deleteMany('mortgages');
exports.updateMortgageInstallment = factory.upsertMany(
  'mortgage_installments',
  'mortgage_id',
);
exports.deleteMortgageInstallment = factory.deleteMany('mortgage_installments');
