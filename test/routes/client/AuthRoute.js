const express = require('express');
const router = express.Router();
const authController = require('../../controllers/client/AuthController');

router.post('/login', authController.login);
router.post('/signup', authController.register);
// router.get('/logout', authController.logout);
module.exports = router;