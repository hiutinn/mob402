const Product = require('../../models/ProductModel')
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const userController = require('./UserController');
var products = 
[
    
];

exports.productindex = (req, res) => {
    res.render('products/index', { layout: "main", products: products, page: "products" });
}

exports.productcreate = (req, res) => {
    var users = userController.users;
    console.log(users);
    res.render('products/create', {layout: "main", page: "products"});
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
    // limits: {
    //     fileSize: 1024 * 1024
    // }
})

exports.productstore = (req, res) => {

    // Use multer to handle file uploads and save file path to database
    imageUpload.single('image')(req, res, (err) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error uploading image');
        } else {
            // Get the file path and add it to the product object
            var filePath = ""
            if (req.file) filePath = req.file.path.replace('public', '');
            console.log(req.body);
            const name = req.body.name;
            const price = req.body.price;
            const image = filePath;
            const color = req.body.color;
            const id = "sp" + Date.now();
            const product = new Product(id, name, price, image, color);
            products.push(product);
            res.redirect('/admin/products')
        }
    });
}

exports.productdelete = (req, res) => {
    console.log("asvavsas")
    const removeIndex = products.findIndex((item) => item.id === req.params.id);
    products.splice(removeIndex, 1);
    res.redirect('/admin/products')
}

exports.productupdate = (req, res) => {
    const index = products.findIndex((item) => item.id === req.params.id);
    var product = products[index];
    res.render('products/update', { layout: "main", product: product, page: "products" })
}

exports.productsave = (req, res) => {
    const index = products.findIndex((item) => item.id === req.params.id);
    imageUpload.single('image')(req, res, (err) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error uploading image');
        } else {
            // Get the file path and add it to the product object
            var filePath = products[index].image;
            if (req.file) filePath = req.file.path.replace('public', '');
            console.log(req.body);
            const name = req.body.name;
            const price = req.body.price;
            const image = filePath;
            const color = req.body.color;
            const id = "sp" + Date.now();
            products[index] = {
                id: id,
                name: name,
                price: price,
                image: image,
                color: color,
            }
            res.redirect('/admin/products')
        }
    });
}
