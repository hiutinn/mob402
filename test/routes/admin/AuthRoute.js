const express = require('express');
const router = express.Router();
const authController = require('../../controllers/admin/AuthController');

router.get('/login', authController.index);
router.post('/login', authController.login);
router.get('/signup', authController.register);
router.post('/signup', authController.createUser);
router.get('/logout', authController.logout);
module.exports = router;