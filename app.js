const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const xss = require('xss-clean');

// const AppError = require('./utils/appError');
// const globalErrorHandler = require('./controllers/errorController');

const salesRouter = require('./routes/salesRoutes');
// const userRouter = require('./routes/userRoutes');
// const reviewRouter = require('./routes/reviewRoutes');

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

// app.use((req, res, next) => {
//   req.requestTime = new Date().toISOString();
//   next();
// });

// 3) ROUTES
app.use('/api/v1/sales', salesRouter);
// app.use('/api/v1/users', userRouter);
// app.use('/api/v1/reviews', reviewRouter);

// app.all('*', (req, res, next) => {
//   next(new AppError(`Cannot find ${req.originalUrl} in the server`, 404));
// });
// app.use(globalErrorHandler);

module.exports = app;
