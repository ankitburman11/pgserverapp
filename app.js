const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const xss = require('xss-clean');

// const AppError = require('./utils/appError');
// const globalErrorHandler = require('./controllers/errorController');

const salesRouter = require('./routes/salesRoutes');
const userRouter = require('./routes/userRoutes');
const productRouter = require('./routes/productRoutes');
const customerRouter = require('./routes/customerRoutes');
const miscRouter = require('./routes/miscRoutes');

const app = express();

// 1) GLOBAL MIDDLEWARES

app.use(helmet());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP. Please try again later',
});

app.use('/api', limiter);

app.use(express.json({ limit: '10kb' }));

// app.use(mongoSanitize());

app.use(xss());

// app.use(
//   hpp({
//     whitelist: [
//       'duration',
//       'ratingsQuantity',
//       'ratingsAverage',
//       'price',
//       'difficulty',
//       'maxGroupSize',
//       'name'
//     ]
//   })
// );

app.use(express.static(`${__dirname}/public`));

app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*');

  // Request methods you wish to allow
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, OPTIONS, PUT, PATCH, DELETE',
  );

  // Request headers you wish to allow
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-Requested-With,content-type',
  );

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});
// app.use((req, res, next) => {
//   req.requestTime = new Date().toISOString();
//   next();
// });

// 3) ROUTES
app.use('/api/v1/sales', salesRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/customers', customerRouter);
app.use('/api/v1/products', productRouter);
app.use('/api/v1/misc', miscRouter);

// app.all('*', (req, res, next) => {
//   next(new AppError(`Cannot find ${req.originalUrl} in the server`, 404));
// });
// app.use(globalErrorHandler);

module.exports = app;
