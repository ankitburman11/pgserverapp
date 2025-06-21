const dotenv = require('dotenv');
if (process.env.NODE_ENV === 'production') {
  dotenv.config({ path: './config.prod.env' });
} else {
  dotenv.config({ path: './config.env' });
}

const postgresql = require('./postgresql');

postgresql();

process.on('uncaughtException', (err) => {
  console.log('Unhandled Exception 💥 Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

const app = require('./app');

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

process.on('unhandledRejection', (err) => {
  console.log('Unhandled Rejection 💥 Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
