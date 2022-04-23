const Tour = require('../models/tourModel');
const Booking = require('../models/bookingModel');

const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getOverview = catchAsync(async (req, res, next) => {
  const tours = await Tour.find();
  res.status(200).render('overview', {
    title: 'All Tours',
    tours
  });
});
exports.getTour = catchAsync(async (req, res, next) => {
  //1) get The Data , For requested tour (including reviews and guides)
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user'
  });
  if (!tour) {
    return next(new AppError('There is no tour with that name.', 404));
  }
  //2) build template
  //3)Render template using data from 1)
  res.status(200).render('tour', {
    title: `${tour.name} Tour`,
    tour
  });
});
exports.getLoginForm = (req, res) => {
  if (!res.locals.user) {
    return res.status(200).render('login', {
      title: 'login into your account'
    });
  }
  res.redirect(`${req.protocol}://${req.get('host')}`);
};
exports.getSignupForm = (req, res) => {
  res.status(200).render('Signup', {
    title: 'Sign UP'
  });
};
exports.getAccount = (req, res) => {
  res.status(200).render('account', {
    title: 'Your Account'
  });
};
exports.updateUserData = (req, res) => {
  // console.log('updating user', req.body);
};
exports.getMyTours = catchAsync(async (req, res, next) => {
  const bookings = await Booking.find({ user: req.user.id });
  // const toursIDs = bookings.map(el => el.tour);
  // const tours = await Tour.find({_id: {$in : toursIDs}})
  const tours = bookings.map(el => el.tour);
  res.status(200).render('overview', {
    title: 'My Booking Tours',
    tours
  });
});
