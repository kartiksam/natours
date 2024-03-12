'use strict';
const AppError = require('./utils/appError');
const globalError = require('./controllers/errorController');
const express = require('express');
const app = express();
const port = 3000;
const morgan = require('morgan');
app.use(express.json());

app.use(morgan('dev'));
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
app.use((req, res, next) => {
  console.log('hello from the middleware');
  next();
});
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});
//middleware mounting
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
// app.all('*', (req, res, next) => {
//   res.status(404).json({
//     status: 'fail',
//     message: `can't find ${req.originalUrl} on server!`,
//   });
// });

// error handling middleware
// app.use((err, req, res, next) => {
//   err.statusCode = err.statusCode || 500;
//   err.status = err.status || 'error';
//   res.status(err.statusCode).json({
//     status: err.status,
//     message: err.message,
//   });
// });
app.all('*', (req, res, next) => {
  next(new AppError(`can't find ${req.originalUrl} on this server!`, 404));
});
app.use(globalError);
module.exports = app;
