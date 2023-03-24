const express = require('express');
const router = express.Router();
const userController = require('../../controllers/admin/UserController');

router.delete('/:id', userController.productdelete);
router.get('/',userController.productindex);
router.get('/update/:id', userController.productupdate);
router.get('/create', userController.productcreate);
router.post('/create', userController.productstore);
router.put('/update/:id', userController.productsave);

module.exports = router;