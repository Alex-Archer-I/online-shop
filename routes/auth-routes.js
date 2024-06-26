const express = require('express');

const authController = require('../controllers/auth-controller');

const router = express.Router();

router.get('/singup', authController.singupPage);

router.post('/singup', authController.singupAction);

router.get('/login', authController.loginPage);

router.post('/login', authController.loginAction);

router.post('/logout', authController.logOut);

module.exports = router;