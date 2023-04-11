const Product = require('../../models/ProductModel');
const Brand = require('../../models/BrandModel');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

exports.index = (req, res) => {
  Product.find().lean().then((products) => {
    res.render('products/', { data: products, page: 'products' });
  }).catch((error) => {
    console.log(error);
  });
};

exports.create = (req, res) => {
  Brand.find().lean().then((brands) => {
    res.render('products/create', { brands: brands, page: 'products' });
  });
};

// SET STORAGE
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
      var dir = 'public/uploads/products';

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

var upload = multer({ storage: storage })

exports.store = (req, res) => {
  // Use multer to handle file uploads and save file path to database
  upload.single('image')(req, res, (err) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error uploading image');
    } else {
      // Get the file path and add it to the product object
      const filePath = req.file.path.replace('public', '');
      var today = new Date();
      const product = new Product({
        name: req.body.name,
        price: req.body.price,
        quantity: req.body.quantity,
        image: filePath,
        // brand_code: req.body.brand_code,
        // is_hot: req.body.is_hot === 'on',
        create_at: today.getDate() + "/" + (today.getMonth() + 1) + "/" + today.getFullYear()
      });

      // Save the product to the database
      product.save().then(() => {
        res.redirect('/admin/products');
      }).catch((error) => {
        console.log(error);
        res.status(500).send('Error saving product');
      });
    }
  });
};

exports.update = (req, res) => {
  Product.findById(req.params.id).lean().then((product) => {
    Brand.find().lean().then((brands) => {
      res.render('products/update', { data: product, brands: brands, page: 'products' });
    });
    
  }).catch((error) => {
    console.log(error);
  });
};

exports.save = (req, res) => {
  upload.single('image')(req, res, (err) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error uploading image');
    } else {
      // Get the file path and add it to the product object
      let filePath = "";
      if (req.file) {
        filePath = req.file.path.replace('public', '');
      }
      
     
      Product.findById(req.params.id).then((product) => {
        product.name = req.body.name;
        product.price = req.body.price;
        product.quantity = req.body.quantity;
        product.image = filePath? filePath : product.image;
        // product.brand_code = req.body.brand_code;
        // product.is_hot = req.body.is_hot === 'on';
        return product.save();
      }).then(() => {
        res.redirect('/admin/products');
      }).catch((error) => {
        console.log(error);
      });
    }
  });
};

exports.delete = (req, res) => {

  Product.findByIdAndDelete(req.params.id).then(() => {
    res.redirect('/admin/products');
  }).catch((error) => {
    console.log(error);
  });

};