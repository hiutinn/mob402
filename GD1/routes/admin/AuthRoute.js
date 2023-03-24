const express = require('express');
const router = express.Router();
const userController = require('../../controllers/admin/UserController');

router.get('/login',userController.loginForm);
router.post('/login',userController.login);

router.get('/signup',userController.signupForm);
router.post('/signup',userController.signup);

module.exports = router;