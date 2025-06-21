const postgresql = require('pg');
const os = require('os');

const { Pool } = postgresql;

module.exports = (callback = null) => {
  // NOTE: PostgreSQL creates a superuser by default on localhost using the OS username.
  const pool = new Pool({
    user: process.env.PGUSER || 'jeweluser',
    database: process.env.PGDATABASE || 'jewelifydb',
    password: process.env.PGPASSWORD || 'jewelpass',
    host: process.env.PGHOST || 'localhost',
    port: process.env.PGPORT || 5432,
  });

  console.log('process.env.NODE_ENV  =>', process.env.NODE_ENV);
  console.log('process.env.PGUSER =>', process.env.PGUSER);
  console.log('process.env.PGDATABASE =>', process.env.PGDATABASE);
  console.log('process.env.PGPASSWORD =>', process.env.PGPASSWORD);
  console.log('process.env.PGHOST =>', process.env.PGHOST);
  console.log('process.env.PGPORT =>', process.env.PGPORT);
  const connection = {
    pool,
    query: (...args) => {
      return pool.connect().then((client) => {
        return client.query(...args).then((res) => {
          client.release();
          return res.rows;
        });
      });
    },
  };

  process.postgresql = connection;

  if (callback) {
    callback(connection);
  }

  return connection;
};
