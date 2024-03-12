const fs = require('fs');
const authControllers = require('./../controllers/authController');
const express = require('express');
const tourControllers = require('./../controllers/tourController');
const router = express.Router();
router.route('/tour-stats').get(tourControllers.getTourStats);
router
  .route('/')
  .get(authControllers.protect, tourControllers.getAllTours)
  .post(tourControllers.createTours);
router

  .route('/:id')
  .get(tourControllers.getTour)
  .patch(tourControllers.updateTours)
  .delete(
    authControllers.protect,
    authControllers.restrictTo('admin', 'lead-guide'),
    tourControllers.deleteTours
  );
module.exports = router;
