const User = require('../../models/UserModel');
const Brand = require('../../models/BrandModel');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

exports.index = (req, res) => {
  User.find().lean().then((users) => {
    res.render('users/', { data: users, page: "users" });
  }).catch((error) => {
    console.log(error);
  });
};

exports.create = (req, res) => {
  User.find().lean().then((users) => {
    res.render('users/create', { data: users, page: "users" });
  }).catch((error) => {
    console.log(error);
  });

};

// SET STORAGE
var storage = multer.diskStorage({
  destination: function (req, file, cb) {

    var dir = 'public/uploads/users';

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, 'public/uploads/users')
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
      // Get the file path and add it to the user object
      const filePath = req.file.path.replace('public', '');
      const birthday = new Date(req.body.birthday);
      const formattedBirthday = `${birthday.getDate()}/${birthday.getMonth() + 1}/${birthday.getFullYear()}`;
      const user = new User({
        email: req.body.email,
        password: req.body.password,
        name: req.body.name,
        birthday: formattedBirthday,
        address: req.body.address,
        phone: req.body.phone,
        gender: req.body.gender,
        role: req.body.role,
        image: filePath,
      });

      // Save the user to the database
      user.save().then(() => {
        res.redirect('/admin/users');
      }).catch((error) => {
        // if (error.name === 'MongoServerError' && error.code === 11000) {
        //   // Duplicate email error
        //   res.status(400).render('users/create', { error: 'Địa chỉ email đã được tồn tại!' });
        // } else {
        console.log(error);
        res.status(500).send('Error saving user');
        // }
      });
    }
  });
};

exports.update = (req, res) => {
  User.findById(req.params.id).lean().then((user) => {
    res.render('users/update', { data: user, page: 'users' });
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
      // Get the file path and add it to the user object
      var filePath = '';
      if (req.file) {
        filePath = req.file.path.replace('public', '');
      }
      User.findById(req.params.id).then((user) => {
        var formattedBirthday = user.birthday
        if (req.body.birthday) {
          const birthday = new Date(req.body.birthday);
          formattedBirthday = `${birthday.getDate()}/${birthday.getMonth() + 1}/${birthday.getFullYear()}`;
        }
        user.email = req.body.email;
        user.password = req.body.password ? req.body.password : user.password;
        user.name = req.body.name;
        user.birthday = formattedBirthday;
        user.address = req.body.address;
        user.phone = req.body.phone;
        user.gender = req.body.gender;
        user.role = req.body.role;
        user.image = filePath == '' ? user.image : filePath;
        return user.save();
      }).then(() => {
        res.redirect('/admin/users');
      }).catch((error) => {
        console.log(error);
        res.status(500).send('Error saving user');
      });
    }
  });
};

exports.delete = (req, res) => {

  User.findByIdAndDelete(req.params.id).then(() => {
    res.redirect('/admin/users');
  }).catch((error) => {
    console.log(error);
  });

};

exports.profile = (req, res) => {
  const id = req.params.id;
  User.findById(id).lean().then((user) => {
    res.render('users/profile', { user: user });
  });
};

exports.editProfile = (req, res) => {
  User.findById(req.params.id).lean().then((user) => {
    res.render('users/editProfile', { data: user });
  }).catch((error) => {
    console.log(error);
  });
};

exports.saveProfile = (req, res) => {
  upload.single('image')(req, res, (err) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error uploading image');
    } else {
      // Get the file path and add it to the user object
      var filePath = '';
      if (req.file) {
        filePath = req.file.path.replace('public', '');
      }


      User.findById(req.params.id).then((user) => {
        var formattedBirthday = user.birthday
        if (req.body.birthday) {
          const birthday = new Date(req.body.birthday);
          formattedBirthday = `${birthday.getDate()}/${birthday.getMonth() + 1}/${birthday.getFullYear()}`;
        }
        user.email = req.body.email;
        user.password = req.body.password ? req.body.password : user.password;
        user.name = req.body.name;
        user.birthday = formattedBirthday;
        user.address = req.body.address;
        user.phone = req.body.phone;
        user.gender = req.body.gender;
        user.image = filePath == '' ? user.image : filePath;
        return user.save();
      }).then(() => {
        res.redirect('/');
      }).catch((error) => {
        console.log(error);
        res.status(500).send('Error saving user');
      });
    }
  });
};
