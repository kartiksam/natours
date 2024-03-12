const fs = require('fs');
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

exports.getAllUsers = (req, res) => {
  res.status(200).json({
    status: 'ERROR',
    message: 'this route is not completed yet',
  });
};
exports.getUsers = (req, res) => {
  res.status(200).json({
    status: 'ERROR',
    message: 'this route is not completed yet',
  });
};
exports.createUsers = (req, res) => {
  res.status(200).json({
    status: 'ERROR',
    message: 'this route is not completed yet',
  });
};
exports.updateUsers = (req, res) => {
  res.status(200).json({
    status: 'ERROR',
    message: 'this route is not completed yet',
  });
};
exports.deleteUsers = (req, res) => {
  res.status(200).json({
    status: 'ERROR',
    message: 'this route is not completed yet',
  });
};
