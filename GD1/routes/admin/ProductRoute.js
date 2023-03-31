const express = require('express');
const router = express.Router();
const productController = require('../../controllers/admin/ProductController');

router.delete('/:id', productController.delete);
router.get('/',productController.index);
router.get('/update/:id', productController.update);
router.get('/create', productController.create);
router.post('/create', productController.store);
router.put('/update/:id', productController.save);

module.exports = router;