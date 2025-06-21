function formatQueryString(str) {
  console.log('str', str);
  return str === '' || str === null
    ? "NULLIF('', '')"
    : isNaN(str)
      ? `'${str}'`
      : str;
}

function composeWhereClause(table, obj) {
  return Object.keys(obj)
    .reduce(
      (acc, el) => (acc += `${table}.${el}=${formatQueryString(obj[el])} and`),
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
    .join('and ');

  return joinClause;
}

function composeConflictSetClause(obj) {
  return Object.keys(obj)
    .filter((el) => el !== 'id')
    .reduce((acc, el) => (acc += `${el}=EXCLUDED.${el}, `), '')
    .trimEnd()
    .slice(0, -1);
}

module.exports = {
  formatQueryString,
  composeWhereClause,
  composeJoinSelectCols,
  composeJoinClause,
  composeConflictSetClause,
};
