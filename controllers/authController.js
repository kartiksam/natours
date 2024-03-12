const sendEmail = require('./../utils/nodemailer');
const crypto = require('crypto');
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const signToken = (id) => {
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};
const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};
exports.signup = catchAsync(async (req, res, next) => {
  const newUser = User.create(req.body);
  createSendToken(newUser, 200, res);
});
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError('please provide email and password', 400));
  }
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }
  createSendToken(user, 200, res);
});
exports.protect = catchAsync(async (req, res, next) => {
  //Getting token and check if its there or not
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return next(new AppError('you dont have any token', 401));
  }
  // verification step
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  console.log(decoded);
  // check if user still exixts

  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError(
        'The user belonging to this token does no longer exists',
        401
      )
    );
  }
  //check if user has changed password after the token issued
  if (currentUser.changePasswordAfter(decoded.iat)) {
    return next(
      new AppError('user recently changed pass pls login again', 401)
    );
  }
  req.user = currentUser;
  next();
});
//authorization
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('you dont have permission to perform the action', 403)
      );
    }
    next();
  };
};
exports.forgotPassword = catchAsync(async (req, res, next) => {
  // get user based on posted email
  const user = await User.findOne({ email: req.body.email });
  console.log(user);
  if (!user) {
    return next(new AppError('There is no user with this email add', 404));
  }
  // generate ranndom token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });
  // send it to user email
  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/resetPassword/${resetToken}`;
  const message = `forgot your password ? submit a patch request with your new password confirm to:${resetURL}.\nIf you didn't forget your pass,please ignore this email`;
  try {
    await sendEmail({
      email: user.email,
      subject: 'your pass restToken (valid for 10 min)',
      message,
    });
    res.status(200).json({
      status: 'success',
      message: 'Token sent to mail',
    });
  } catch (err) {
    user.createPasswordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(
      new AppError('there was an error sending email, try again later', 500)
    );
  }
});
//
exports.resetPassword = catchAsync(async (req, res, next) => {
  //get user based on the given token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');
  //get user from database because password store in database in encrypted form
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
    //if token has niot expired and there is a user
  });
  if (!user) {
    return next(new AppError('Token is innvalid or expired', 400));
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  console.log(user);
  //login the user
  createSendToken(user, 200, res);
});
//updating the current user password
exports.updatePassword = catchAsync(async (req, res, next) => {
  //get userr from collection
  const user = await User.findById(req.user.id).select('+password');
  //check if posted current password is correct or not
  if (
    !(await user.correctPassword('req.body.passwordCurrennt', 'user.password'))
  ) {
    return next(new AppError('your current password is wrong', 401));
  }
  // if so update the password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();

  createSendToken(user, 200, res);
});
