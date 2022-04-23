const express = require('express');
const path = require('path');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const morgan = require('morgan');
const xss = require('xss-clean');
const cors = require('cors');
const hpp = require('hpp');
const mongoSanitize = require('express-mongo-sanitize');
const cookieParser = require('cookie-parser');
const compression = require('compression');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controller/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const bookingRouter = require('./routes/bookingRoutes');
const viewRouter = require('./routes/viewRoutes');

const app = express();
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
// app.use(helmet({ contentSecurityPolicy: false }));
// const scriptSrcUrls = [
//   'https://api.tiles.mapbox.com/',
//   'https://api.mapbox.com/'
// ];
// const styleSrcUrls = [
//   'https://api.mapbox.com/',
//   'https://api.tiles.mapbox.com/',
//   'https://fonts.googleapis.com/'
// ];
// const connectSrcUrls = [
//   'https://api.mapbox.com/',
//   'https://a.tiles.mapbox.com/',
//   'https://b.tiles.mapbox.com/',
//   'https://events.mapbox.com/'
// ];
// const fontSrcUrls = ['fonts.googleapis.com', 'fonts.gstatic.com'];
// app.use(
//   helmet.contentSecurityPolicy({
//     directives: {
//       defaultSrc: [],
//       connectSrc: ["'self'", ...connectSrcUrls],
//       scriptSrc: ["'self'", ...scriptSrcUrls],
//       styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
//       workerSrc: ["'self'", 'blob:'],
//       objectSrc: [],
//       imgSrc: ["'self'", 'blob:', 'data:'],
//       fontSrc: ["'self'", ...fontSrcUrls]
//     }
//   })
// );
// if (process.env.NODE_ENV === 'development') {
//   app.use(morgan('dev'));
// }
app.use(morgan('dev'));
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requist from this IP, Please try again in an hour!'
});

app.use(express.json());
app.use(cookieParser());
app.use((req, res, next) => {
  req.requistTime = new Date().toISOString();
  // console.log(req.cookies);
  next();
});
app.use('/api', limiter);
//Data Sanitization against NoSQL query injection
app.use(mongoSanitize());

//Data Sanitization against xss
app.use(xss());
//prevent parameter pollution
app.use(
  hpp({
    whitelist: ['duration', 'ratingQuanity', 'price']
  })
);
app.use(compression());
// app.use((req, res, next) => {
//   res.setHeader(
//     'Content-Security-Policy',
//     "script-src 'self' api.mapbox.com",
//     "script-src-elem 'self' api.mapbox.com"
//   );
//   next();
// });
app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this serverrrr!`, 404));
});
app.use(globalErrorHandler);

module.exports = app;
