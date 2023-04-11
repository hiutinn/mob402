const express = require('express');
const router = express.Router();
const brandController = require('../../controllers/client/BrandController');

router.get('/', brandController.getBrands);
router.get('/:id', brandController.getBrandById);
// router.get('/:code', brandController.getBrandByCode);
router.post('/', brandController.createBrand);
router.put('/:id', brandController.updateBrand);
router.delete('/:id', brandController.deleteBrand);

module.exports = router;