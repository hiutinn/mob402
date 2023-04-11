const express = require('express');
const router = express.Router();
const userController = require('../../controllers/client/UserController');
const authMiddleware = require('../../middlewares/authMiddleware');

router.get('/',authMiddleware.clientVerifyLogin, userController.getUsers);
router.get('/:id',authMiddleware.clientVerifyLogin, userController.getUserById);
router.post('/',authMiddleware.clientVerifyLogin, userController.createUser);
router.put('/:id',authMiddleware.clientVerifyLogin, userController.updateUser);
router.delete('/:id',authMiddleware.clientVerifyLogin, userController.deleteUser);


module.exports = router;