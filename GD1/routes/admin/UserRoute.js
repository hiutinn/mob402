const express = require('express');
const router = express.Router();
const userController = require('../../controllers/admin/UserController');

router.delete('/:id', userController.delete);
router.get('/',userController.index);
router.get('/update/:id', userController.update);
router.get('/create', userController.create);
router.post('/create', userController.store);
router.put('/update/:id', userController.save);


module.exports = router;