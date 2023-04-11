const express = require('express');
const router = express.Router();
const productController = require('../../controllers/client/ProductController');
const authMiddleware = require('../../middlewares/authMiddleware');

router.get('/',authMiddleware.clientVerifyLogin, productController.getProducts);
router.get('/:id',authMiddleware.clientVerifyLogin, productController.getProductById);
// router.get('/brands/:brand/products', productController.getProductsByBrand);
router.post('/',authMiddleware.clientVerifyLogin, productController.createProduct);
router.put('/:id',authMiddleware.clientVerifyLogin, productController.updateProduct);
router.delete('/:id',authMiddleware.clientVerifyLogin, productController.deleteProduct);


module.exports = router;