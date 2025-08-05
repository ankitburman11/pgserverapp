function formatQueryString(key, val) {
  const isDate = typeof key === 'string' && key.endsWith('_date');
  if (val === '' || val === null) {
    return `NULLIF('', '')${isDate ? '::date' : ''}`;
  }
  if (isDate) {
    return `'${val}'::date`;
  }
  if (isNaN(val) && val !== 'current_timestamp') {
    return `'${val}'`;
  }
  return val;
}

function composeWhereClause(table, obj) {
  console.log('obj', obj);
  return Object.keys(obj)
    .reduce(
      (acc, el) =>
        (acc += `${table}.${el}=${formatQueryString(el, obj[el])} and`),
      '',
    )
    .slice(0, -3);
}

function composeJoinSelectCols(references) {
  const selectCols = references
    .map(
      (reference) =>
        `${reference.selectCols.map((el) => `${reference.joinTable}.${el.col} as ${el.alias}`)}`,
    )
    .join(', ');

  return selectCols;
}

function composeJoinClause(references) {
  const joinClause = references
    .map(
      (reference) =>
        `${reference.join} ${reference.joinTable} ON ${reference.cols.map(
          (el) =>
            `${reference.mainTable}.${el.primary}=${reference.joinTable}.${el.foreign}`,
        )} `,
    )
    .join(' ');

  return joinClause;
}

function composeConflictSetClause(obj) {
  return Object.keys(obj)
    .filter((el) => el !== 'id')
    .reduce((acc, el) => (acc += `${el}=EXCLUDED.${el}, `), '')
    .trimEnd()
    .slice(0, -1);
}

/* Unutilized */
function isValidDateFormat(str) {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  return regex.test(str);
}

function formatDateLocal(date) {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

/* Unutilized */
function stripDateFieldsFlat(row) {
  for (const key in row) {
    if (key.endsWith('_date') && row[key] instanceof Date) {
      row[key] = formatDateLocal(row[key]);
    }
  }
  return row;
}

module.exports = {
  formatQueryString,
  composeWhereClause,
  composeJoinSelectCols,
  composeJoinClause,
  composeConflictSetClause,
  isValidDateFormat,
  stripDateFieldsFlat,
};
