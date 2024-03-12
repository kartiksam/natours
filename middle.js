const express = require('express');
const app = express();
const fs = require('fs');
const port = 3000;
app.use(express.json());
const tours = fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`);
app.use((req, res, next) => {
  console.log('hello from the middleware');
  next();
});
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});
app.get('/api/v1/tours', (req, res) => {
  console.log(req.requestTime);
  res.status(200).json({
    status: 'success',
    results: tours.length,
    requestedAt: req.requestTime,
    data: {
      tours,
    },
  });
});
app.listen(port, () => {
  console.log(`app running on port ${port}`);
});
