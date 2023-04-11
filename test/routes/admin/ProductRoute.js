const express = require('express');
const router = express.Router();
const productController = require('../../controllers/admin/ProductController');
const authMiddleware = require('../../middlewares/authMiddleware');

router.delete('/:id',authMiddleware.isAdmin, productController.delete);
router.get('/',authMiddleware.isAdmin,productController.index);
router.get('/update/:id',authMiddleware.isAdmin, productController.update);
router.get('/create',authMiddleware.isAdmin, productController.create);
router.post('/create',authMiddleware.isAdmin, productController.store);
router.put('/update/:id',authMiddleware.isAdmin, productController.save);

module.exports = router;