const catchAsync = require('../utils/catchAsync');

exports.createOne = (table) =>
  catchAsync(async (req, res, next) => {
    console.log('creating ', table);
    const cols = Object.keys(req.body);
    const val = Object.values(req.body).map((el) => formatQueryString(el));
    const queryText = `INSERT INTO ${table}(${cols.join(',')}) VALUES(${val.join(',')})`;
    console.log(queryText);
    const rows = await process.postgresql.query(queryText);

    res.status(201).json({
      status: 'success',
      data: {
        data: rows,
      },
    });
  });

exports.getAll = (table) =>
  catchAsync(async (req, res, next) => {
    const queryText = `SELECT * FROM ${table}`;
    const rows = await process.postgresql.query(queryText);

    // SEND RESPONSE
    res.status(200).json({
      status: 'success',
      results: rows.length,
      data: {
        data: rows,
      },
    });
  });

exports.getOne = (table) =>
  catchAsync(async (req, res, next) => {
    const queryText = `SELECT * FROM ${table} WHERE ${composeWhereClause(req.params)}`;
    const rows = await process.postgresql.query(queryText);

    // SEND RESPONSE
    res.status(200).json({
      status: 'success',
      results: rows.length,
      data: {
        data: rows,
      },
    });
  });

exports.upsertMany = (table) =>
  catchAsync(async (req, res, next) => {
    const cols = Object.keys(req.body[0]);
    const val = req.body
      .map((el) => {
        const valueStr = Object.values(el)
          .map((el) => formatQueryString(el))
          .join(',');
        return `(${valueStr})`;
      })
      .join(',');

    console.log('upsert val', val);

    const queryText = `INSERT INTO ${table}(${cols.join(',')})
                        VALUES ${val}
                        ON CONFLICT (id) DO UPDATE
                        SET ${composeConflictSetClause(req.body[0])}
                        WHERE ${table}.id=EXCLUDED.id
                        RETURNING *`;

    console.log('upsert queryText', queryText);
    const rows = await process.postgresql.query(queryText);

    if (!rows) {
      return next(new AppError('No document found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: rows,
    });
  });

exports.deleteMany = (table) =>
  catchAsync(async (req, res, next) => {
    const queryText = `DELETE FROM ${table} WHERE ${composeWhereClause(req.params)}`;
    const rows = await process.postgresql.query(queryText);

    if (!rows) {
      return next(new AppError('No document found with that ID', 404));
    }

    res.status(204).json({
      status: 'success',
      data: null,
    });
  });

const formatQueryString = (str) => {
  return isNaN(str) ? `'${str}'` : str;
};

const composeWhereClause = (obj) => {
  return Object.keys(obj)
    .reduce((acc, el) => (acc += `${el}=${formatQueryString(obj[el])} and`), '')
    .slice(0, -3);
};

const composeConflictSetClause = (obj) => {
  return Object.keys(obj)
    .filter((el) => el !== 'id')
    .reduce((acc, el) => (acc += `${el}=EXCLUDED.${el}, `), '')
    .trimEnd()
    .slice(0, -1);
};
