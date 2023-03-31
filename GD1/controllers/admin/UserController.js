const User = require('../../models/UserModel');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Product = require('../../models/ProductModel')
var users = [
    new User("u1", "admin@gmail.com", "123456", "Nguyen", "Addmin", "")
];

exports.index = (req, res) => {
    res.render('users/index', { layout: "main", users: users, page: "users" });
}

exports.create = (req, res) => {
    res.render('users/create', { layout: "main", page: "users" });
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

exports.store = (req, res) => {

    // Use multer to handle file uploads and save file path to database
    imageUpload.single('image')(req, res, (err) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error uploading image');
        } else {
            // Get the file path and add it to the User object
            var filePath = ""
            if (req.file) filePath = req.file.path.replace('public', '');
            console.log(req.body);
            const email = req.body.email;
            const password = req.body.password;
            const firstname = req.body.firstname;
            const lastname = req.body.lastname;
            const image = filePath;
            const id = "u" + Date.now();
            const user = new User(id, email, password, firstname, lastname, image);
            users.push(user);
            res.redirect('/admin/users')
        }
    });
}

exports.delete = (req, res) => {
    const removeIndex = users.findIndex((item) => item.id === req.params.id);
    users.splice(removeIndex, 1);
    res.redirect('/admin/users')
}

exports.update = (req, res) => {
    const index = users.findIndex((item) => item.id === req.params.id);
    var user = users[index];
    res.render('users/update', { layout: "main", user: user, page: "users" })
}

exports.save = (req, res) => {
    const index = users.findIndex((item) => item.id === req.params.id);
    imageUpload.single('image')(req, res, (err) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error uploading image');
        } else {
            // Get the file path and add it to the User object
            var filePath = users[index].image;
            if (req.file) filePath = req.file.path.replace('public', '');
            console.log(req.body);
            const email = req.body.email;
            const password = req.body.password;
            const firstname = req.body.firstname;
            const lastname = req.body.lastname;
            const image = filePath;
            const id = "u" + Date.now();
            users[index] = {
                id: id,
                email: email,
                password: password,
                firstname: firstname,
                lastname: lastname,
                image: image,
            }
            res.redirect('/admin/users')
        }
    });
}


exports.loginForm = (req, res) => {
    res.render('auth/login', { layout: "auth" });
}

exports.login = (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    var check = false;
    users.forEach(user => {
        if (user.email === email && user.password === password) {

            check = true;
        }
    })

    if (check) {
        res.redirect('/admin/users')
    } else {
        res.render('auth/login', { layout: "auth", error: "Thông tin đăng nhập sai!" });
    }
}

exports.signupForm = (req, res) => {
    res.render('auth/signup', { layout: "auth" });
}

exports.signup = (req, res) => {

    // Use multer to handle file uploads and save file path to database
    imageUpload.single('image')(req, res, (err) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error uploading image');
        } else {
            // Get the file path and add it to the User object
            var filePath = ""
            if (req.file) {
                filePath = req.file.path.replace('public', '');
            }
            // console.log(req.body);
            const email = req.body.email;
            const password = req.body.password;
            const firstname = req.body.firstname;
            const lastname = req.body.lastname;
            const image = filePath;
            const id = "u" + Date.now();
            const user = new User(id, email, password, firstname, lastname, image);
            users.push(user);
            res.redirect('/admin/auth/login')
        }
    });
}
