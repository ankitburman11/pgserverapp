exports.getAllSales = async () => {
  const queryText = 'SELECT * FROM sales';
  const rows = await process.postgresql.query(queryText);
  return rows;
};
