const express = require('express');
const router = express.Router();
const userController = require('../../controllers/admin/UserController');
const authMiddleware = require('../../middlewares/authMiddleware');

router.delete('/:id',authMiddleware.isAdmin, userController.delete);
router.get('/',authMiddleware.isAdmin,userController.index);
router.get('/update/:id',authMiddleware.isAdmin, userController.update);
router.get('/create',authMiddleware.isAdmin, userController.create);
router.post('/create',authMiddleware.isAdmin, userController.store);
router.put('/update/:id',authMiddleware.isAdmin, userController.save);
router.get('/profile/:id',authMiddleware.verifyLogin, userController.profile);
router.get('/editProfile/:id',authMiddleware.verifyLogin, userController.editProfile);
router.put('/editProfile/:id',authMiddleware.verifyLogin, userController.saveProfile);
module.exports = router;