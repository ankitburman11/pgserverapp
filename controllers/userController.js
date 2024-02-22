const factory = require('./handlerFactory');

// exports.createUser = (req, res) => {
//   res.status(500).json({
//     status: 'error',
//     message: 'This route is not defined! Please use /signup instead',
//   });
// };

exports.createUser = factory.createOne('admins');
exports.getAllUsers = factory.getAll('admins');
exports.getUser = factory.getOne('admins');
