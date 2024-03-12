const fs = require('fs');
const express = require('express');
const crypto = require('crypto');

const userControllers = require('./../controllers/userController');
const authControllers = require('./../controllers/authController');
const router = express.Router();
//signup is a special type of input and does not fit foir rest of api
router.post('/signup', authControllers.signup);
router.post('/login', authControllers.login);
router.post('/forgotpassword', authControllers.forgotPassword);
router.patch('/resetpassword/:token', authControllers.resetPassword);
router.patch(
  '/updatepassword',
  authControllers.protect,
  authControllers.updatePassword
);
router
  .route('/')
  .get(userControllers.getAllUsers)
  .post(userControllers.createUsers);
router
  .route('/:id')
  .get(userControllers.getAllUsers)
  .patch(userControllers.updateUsers)
  .delete(userControllers.deleteUsers);
module.exports = router;
