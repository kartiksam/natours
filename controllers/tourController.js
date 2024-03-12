const apifeatures = require('./../utils/apiFeatures');
const Tour = require('./../models/tourmodels');
const fs = require('fs');
const catchAsync = require('./../utils/catchAsync');
// These all below usinmg the json file operatons
// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// );

// exports.getAllTours = (req, res) => {
//   res.status(200).json({
//     status: 'ERROR',
//     message: 'its time to fuck ',
//   });
// };
// exports.getTour = (req, res) => {
//   res.status(200).json({
//     status: 'ERROR',
//     message: 'this route is not completed yet',
//   });
// };
// exports.createTours = (req, res) => {
//   res.status(200).json({
//     status: 'ERROR',
//     message: 'this route is not completed yet',
//   });
// };
// exports.updateTours = (req, res) => {
//   res.status(200).json({
//     status: 'ERROR',
//     message: 'this route is not completed yet',
//   });
// };
// exports.deleteTours = (req, res) => {
//   res.status(200).json({
//     status: 'ERROR',
//     message: 'this route is not completed yet',
//   });
// };
//now using the db

exports.createTours = catchAsync(async (req, res, next) => {
  const newtour = await Tour.create(req.body);
  res.status(200).json({
    status: 'suceess',
    data: {
      tour: newtour,
    },
  });
});

//get all tours
exports.getAllTours = async (req, res) => {
  //   try {
  //     const tours = await Tour.find();
  //     res.status(200).json({
  //       status: 'suceess',
  //       data: {
  //         tours,
  //       },
  //     });
  //   } catch (err) {
  //     res.status(400).json({
  //       status: 'fail',
  //       message: err,
  //     });
  //   }
  // };
  const features = new apifeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const tours = await features.query;
  res.status(200).json({
    status: 'suceess',
    data: {
      tours,
    },
  });
};
// get a tour
exports.getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id);
  res.status(200).json({
    status: 'suceess',
    data: {
      tour,
    },
  });
});
//update
exports.updateTours = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status: 'suceess',
    data: {
      tour,
    },
  });
});
//delete tours
exports.deleteTours = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndDelete(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status: 'suceess deleted',
  });
});
//Aggregation pipeline
exports.getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: 4.5 },
    },
    {
      $group: {
        _id: null,
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxprice: { $max: '$price' },
        num: { $sum: 1 },
      },
    },
  ]);
  res.status(200).json({
    stats: 'success',
    data: {
      stats,
    },
  });
});
