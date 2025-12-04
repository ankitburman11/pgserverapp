const catchAsync = require('../utils/catchAsync');
const utils = require('../utils/utils');

exports.createOne = (table) =>
  catchAsync(async (req, res, next) => {
    console.log('creating ', table);
    const cols = Object.keys(req.body);
    console.log('req.body', req.body);
    console.log('Object vals', Object.values(req.body));
    const val = Object.values(req.body).map((el) =>
      utils.formatQueryString(el),
    );
    console.log('values', val);
    const queryText = `INSERT INTO ${table}(${cols.join(',')}) VALUES(${val.join(',')})`;
    console.log(queryText);
    const rows = await process.postgresql.query(queryText);

    res.status(201).json({
      status: 'success',
      data: {
        records: rows,
      },
    });
  });

exports.getAll = (table, references = null, selectedCols = null) =>
  catchAsync(async (req, res, next) => {
    const joinClause = references?.length
      ? utils.composeJoinClause(references)
      : '';
    const joinSelectCols = references?.length
      ? ',' + utils.composeJoinSelectCols(references)
      : '';
    // If selectedCols provided, format date columns using TO_CHAR
    const baseCols = selectedCols
      ? selectedCols
          .map((col) =>
            col.endsWith('_date')
              ? `TO_CHAR(${table}."${col}", 'YYYY-MM-DD') AS "${col}"`
              : `${table}."${col}"`,
          )
          .join(', ')
      : `${table}.*`;
    const queryText = `SELECT ${baseCols} ${joinSelectCols} FROM ${table} ${joinClause}`;

    console.log('getAll query', queryText);
    let rows = await process.postgresql.query(queryText);
    // SEND RESPONSE
    res.status(200).json({
      status: 'success',
      results: rows.length,
      data: {
        records: rows,
      },
    });
  });

exports.getOne = (table, references = null, selectedCols = null) =>
  catchAsync(async (req, res, next) => {
    const joinClause = references?.length
      ? utils.composeJoinClause(references)
      : '';
    const joinSelectCols = references?.length
      ? ',' + utils.composeJoinSelectCols(references)
      : '';

    // If selectedCols provided, format date columns using TO_CHAR
    const baseCols = selectedCols
      ? selectedCols
          .map((col) =>
            col.endsWith('_date')
              ? `TO_CHAR(${table}."${col}", 'YYYY-MM-DD') AS "${col}"`
              : `${table}."${col}"`,
          )
          .join(', ')
      : `${table}.*`;
    const queryText = `SELECT ${baseCols} ${joinSelectCols} FROM ${table} ${joinClause} WHERE ${utils.composeWhereClause(table, req.params)}`;
    console.log('getOne query', queryText);

    const rows = await process.postgresql.query(queryText);

    // SEND RESPONSE
    res.status(200).json({
      status: 'success',
      results: rows.length,
      data: {
        records: rows,
      },
    });
  });

exports.upsertMany = (table, idField) =>
  catchAsync(async (req, res, next) => {
    const cols = Object.keys(req.body[0]);
    const val = req.body
      .map((el) => {
        console.log('el', el);
        const valueStr = Object.entries(el)
          .map(([key, val]) => utils.formatQueryString(key, val))
          .join(',');
        return `(${valueStr})`;
      })
      .join(',');

    console.log('upsert val', val);

    const queryText = `INSERT INTO ${table}(${cols.join(',')})
                        VALUES ${val}
                        ON CONFLICT (id) DO UPDATE
                        SET ${utils.composeConflictSetClause(req.body[0])}
                        WHERE ${table}.id=EXCLUDED.id
                        RETURNING *`;

    console.log('upsert queryText', queryText);
    const rows = await process.postgresql.query(queryText);

    console.log('rows', rows);

    if (!rows) {
      return next(new AppError('No row found with that ID', 404));
    }
    req.params = {
      ...req.params,
      id: req.body[0]?.[idField] || req.body[0].id || rows[0].id,
    };
    console.log('req.params', req.params);
    req.body = { ...req.body, upsertedData: rows };
    next();
    /* res.status(200).json({
      status: 'success',
      data: { records: rows },
    }); */
  });

exports.deleteMany = (table) =>
  catchAsync(async (req, res, next) => {
    console.log('req.params', req.params);
    console.log(
      'utils.composeWhereClause(table, req.params)',
      utils.composeWhereClause(table, req.params),
    );
    const queryText = `DELETE FROM ${table} WHERE ${utils.composeWhereClause(table, req.params)}`;
    const rows = await process.postgresql.query(queryText);

    if (!rows) {
      return next(new AppError('No row found with that ID', 404));
    }

    res.status(204).json({
      status: 'success',
      data: null,
    });
  });

exports.upsertParentWithChildren = (
  parentTable,
  childTable,
  parentKey = 'id',
  childForeignKey = null,
) =>
  catchAsync(async (req, res, next) => {
    const { parent, children } = req.body;
    if (!parent || !Array.isArray(children)) {
      return res.status(400).json({
        status: 'fail',
        message: 'Request body must have parent and children arrays.',
      });
    }

    // 1. Upsert parent
    const parentCols = Object.keys(parent);
    const parentVals = parentCols.map((col) =>
      utils.formatQueryString(col, parent[col]),
    );
    const parentQuery = `
      INSERT INTO ${parentTable}(${parentCols.join(',')})
      VALUES(${parentVals.join(',')})
      ON CONFLICT (${parentKey}) DO UPDATE
      SET ${utils.composeConflictSetClause(parent)}
      WHERE ${parentTable}.${parentKey}=EXCLUDED.${parentKey}
      RETURNING *;
    `;
    const [savedParent] = await process.postgresql.query(parentQuery);

    // 2. Upsert children
    if (children.length > 0) {
      const childCols = Object.keys(children[0]);
      // Determine the foreign key column name
      const fk = childForeignKey || `${parentTable.slice(0, -1)}_id`;
      const itemVals = children
        .map((item) => {
          // Ensure foreign key is set
          const fullItem = { ...item, [fk]: savedParent[parentKey] };
          return `(${childCols.map((col) => utils.formatQueryString(col, fullItem[col])).join(',')})`;
        })
        .join(',');

      const childQuery = `
        INSERT INTO ${childTable}(${childCols.join(',')})
        VALUES ${itemVals}
        ON CONFLICT (id) DO UPDATE
        SET ${utils.composeConflictSetClause(children[0])}
        RETURNING *;
      `;
      await process.postgresql.query(childQuery);
    }

    res.status(200).json({
      status: 'success',
      data: { [parentTable]: savedParent, [childTable]: children },
    });
  });
