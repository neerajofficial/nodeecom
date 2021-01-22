const express = require('express');

const authController = require('../controllers/auth');
const validator = require('./../middleware/validator');

const router = express.Router();

router.get('/login', authController.getLogin);

router.get('/signup', authController.getSignup);

router.get('/reset', authController.getReset);

router.post('/login', validator.login, authController.postLogin);

router.post('/signup', validator.signup, authController.postSignup);

router.post('/logout', authController.postLogout);

router.post('/reset', authController.postReset);

router.get('/reset/:token', authController.getNewPassword);

router.post('/new-password', authController.postNewPassword);

module.exports = router;