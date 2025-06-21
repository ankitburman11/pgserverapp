const catchAsync = require('../utils/catchAsync');

async function getColumnNames(tableName) {
  const queryText = `
          SELECT column_name
          FROM information_schema.columns
          WHERE table_name = '${tableName}';
        `;
  const rows = await process.postgresql.query(queryText);
  return rows.map((row) => row.column_name);
}

exports.removeNonColumnProps = catchAsync(async (req, res, next) => {
  const baseEndpoint = req.baseUrl.split('/').at(-1);
  const columnNames = await getColumnNames(baseEndpoint);
  const body = req.body[0];

  // Remove properties that are not in the column names
  for (const key in body) {
    if (!columnNames.includes(key)) {
      delete body[key];
    }
  }
  next();
});
