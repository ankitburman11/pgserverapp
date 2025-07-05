const utils = require('../utils/utils');

exports.getAllCustomers = async () => {
  const queryText =
    'SELECT c.*, c.initial_balance as balance FROM customers c ORDER BY id DESC';
  const rows = await process.postgresql.query(queryText);
  return rows;
};

exports.getCustomer = async (req) => {
  console.log('req.params', req.params);
  const queryText = `SELECT *, initial_balance as balance FROM customers  
                        WHERE ${utils.composeWhereClause('customers', req.params)} 
                        ORDER BY id DESC`;
  const rows = await process.postgresql.query(queryText);
  return rows;
};
