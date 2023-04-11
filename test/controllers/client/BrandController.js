const Brand = require('../../models/BrandModel');

exports.getBrands = async (req, res) => {
    try {
        const brands = await Brand.find();
        res.status(200).json(brands);
    } catch (error) {
        // res.status(500).json({ message: error.message });
    }
};

// exports.getBrandByCode = async (req, res) => {
//     try {
//         const brands = await Brand.find({code: req.params.code});
//         res.status(200).json(brands);
//     } catch (error) {
//         // res.status(500).json({ message: error.message });
//     }
// };

exports.getBrandById = async (req, res) => {
    try {
        const brand = await Brand.findById(req.params.id);
        res.status(200).json(brand);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createBrand = async (req, res) => {
    const brand = new Brand(req.body);
    try {
        const newBrand = await brand.save();
        res.status(201).json(newBrand);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.updateBrand = async (req, res) => {
    try {
        const brand = await Brand.findById(req.params.id);
        if (req.body.name) brand.name = req.body.name;
        if (req.body.description) brand.description = req.body.description;
        if (req.body.price) brand.price = req.body.price;
        const updatedBrand = await brand.save();
        res.status(200).json(updatedBrand);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deleteBrand = async (req, res) => {
    try {
        await Brand.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Brand deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};