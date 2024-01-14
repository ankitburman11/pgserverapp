exports.getAllSales = async () => {
  const queryText = 'SELECT * FROM some_table';
  const rows = await process.postgresql.query(queryText);
  return rows;
};
