const Product = require('../../models/ProductModel')
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');

const uri = "mongodb+srv://hieuntph22081:ee2IcQpVd8S5SAn8@cluster0.hz05q9o.mongodb.net/?retryWrites=true&w=majority";

    exports.index = async (req, res) => {
        await mongoose.connect(uri);
        await Product.find().lean()
            .then(products => {
                res.render('products/index', { layout: "main", products: products, page: "products" });
            })
    }

exports.create = (req, res) => {
    res.render('products/create', { layout: "main", page: "products" });
}

// SET STORAGE
var storage = multer.diskStorage({
    destination: function (req, file, cb) {

        var dir = './public/uploads/products';

        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, 'public/uploads/products')
    },
    filename: function (req, file, cb) {
        var tenGoc = file.originalname;
        arr = tenGoc.split('.');
        let newFileName = '';
        for (var i = 0; i < arr.length; i++) {
            if (i != arr.length - 1) {
                newFileName += arr[i];
            } else {
                newFileName += ('-' + Date.now() + '.' + arr[i]);
            }
        }
        cb(null, newFileName)
    }
})

var imageUpload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        if (file) {
            var ext = path.extname(file.originalname);
            if (ext !== '.jpg' && ext !== '.png' && ext !== '.jfif' && ext !== '.gif' && ext !== '.jpeg') {

                return cb(new Error('Invalid file extension'));
            }

            cb(null, true)
        }
    },
})

exports.store = async (req, res) => {
    await mongoose.connect(uri);
    // Use multer to handle file uploads and save file path to database
    imageUpload.single('image')(req, res, (err) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error uploading image');
        } else {
            // Get the file path and add it to the product object
            var filePath = ""
            if (req.file) filePath = req.file.path.replace('public', '');
            const name = req.body.name;
            const price = req.body.price;
            const image = filePath;
            const color = req.body.color;
            const type = req.body.type;

            const product = new Product({
                name: name,
                price: price,
                image: image,
                color: color,
                type: type
            });

            product.save().then(() => {
                res.redirect('/admin/products');
            }).catch((error) => {
                console.log(error);
                res.status(500).send('Error saving product');
            });
        }
    });
}

exports.delete = async (req, res) => {
    await mongoose.connect(uri);
    Product.findByIdAndDelete(req.params.id).then(() => {
        res.redirect('/admin/products');
    }).catch((error) => {
        console.log(error);
    });
    res.redirect('/admin/products')
}

exports.update = async (req, res) => {
    await mongoose.connect(uri);
    Product.findById(req.params.id).lean().then((product) => {
          res.render('products/update', { product: product, page: 'products' });
      }).catch((error) => {
        console.log(error);
      });
}

exports.save = async (req, res) => {
    await mongoose.connect(uri);
    imageUpload.single('image')(req, res, (err) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error uploading image');
        } else {
            // Get the file path and add it to the product object
            var filePath = "";
            if (req.file) filePath = req.file.path.replace('public', '');
            Product.findById(req.params.id).then((product) => {
                product.name = req.body.name;
                product.price = req.body.price;
                product.image = filePath ? filePath : product.image;
                product.color = req.body.color;
                product.type = req.body.type;          
                return product.save();
              }).then(() => {
                res.redirect('/admin/products');
              }).catch((error) => {
                console.log(error);
              });
            res.redirect('/admin/products')
        }
    });
}
