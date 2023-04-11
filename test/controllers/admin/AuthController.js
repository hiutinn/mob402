const User = require('../../models/UserModel');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { session } = require('passport');

exports.index = (req, res) => {
    res.render('auth/login', { layout: 'auth' });
}

exports.login = (req, res) => {
    User.findOne({
        email: req.body.email
    }).then((user, err) => {
        if (err) throw err;

        if (!user) {
            // res.status(401).send({ success: false, msg: 'Authentication failed. User not found.' });
            res.render('auth/login', { layout: 'auth', error: 'Không tìm thấy người dùng' });
        } else {
            // check if password matches
            user.comparePassword(req.body.password, function (err, isMatch) {
                if (isMatch && !err) {
                    // if user is found and password is right create a token
                    var token = jwt.sign({userId: user._id, userRole: user.role}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '30m'});
                    req.session.accessToken = token;
                    res.redirect(`/admin/users/profile/${user._id}`);
                } else {
                    res.status(401).send({ success: false, msg: 'Authentication failed. Wrong password.' });
                }
            });
        }
    }).catch(function (err) {
        res.status(404).send({ success: false, msg: `Error ${err}` });
    });
};

exports.register = (req, res) => {
    res.render('auth/signup', { layout: "auth" });
}

// SET STORAGE
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        var dir = './public/uploads/users';
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

exports.createUser = (req, res) => {
    // Use multer to handle file uploads and save file path to database
    imageUpload.single('image')(req, res, async (err) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error uploading image');
        } else {
            // Get the file path and add it to the User object
            var filePath = ""
            if (req.file) {
                filePath = req.file.path.replace('public', '');
            }
            const birthday = new Date(req.body.birthday);
            const formattedBirthday = `${birthday.getDate()}/${birthday.getMonth() + 1}/${birthday.getFullYear()}`;
            console.log(req.body.password);
            const hashedPassword = await bcrypt.hash(req.body.password, 10);
           
            const user = new User({
                email: req.body.email,
                password: hashedPassword,
                name: req.body.name,
                birthday: formattedBirthday,
                address: req.body.address,
                phone: req.body.phone,
                gender: req.body.gender,
                role: 1,
                image: filePath,
                is_active: true
            });
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
            })
        }
    });
};

exports.logout = (req, res) => {
    req.session.destroy();
    res.redirect('/auth/login');
};
