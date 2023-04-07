var passport = require('passport');
var config = require('../config/database');
require('../config/Passport')(passport);
var express = require('express');
var jwt = require('jsonwebtoken');
var router = express.Router();
var User = require("../models/user");
var Book = require("../models/book");
const authMiddleware = require('../middlewares/authMiddleware');

const app = express();

const bodyParser = require("body-parser");

// // parse requests of content-type - application/json
router.use(bodyParser.json());  

const parser = bodyParser.urlencoded({ extended: true });

router.use(parser);

router.post('/signup', async function (req, res) {
    console.log(req.body);
    if (!req.body.email || !req.body.password) {
        res.json({ success: false, msg: 'Please pass username and password.' });
    } else {
        var newUser = new User({
            email: req.body.email,
            password: req.body.password
        });
        // save the user
        await newUser.save();

        res.json({ success: true, msg: 'Successful created new user.' });
    }
});

router.get('/signin', (req, res) => {
    res.render('signin', {layout: 'auth'});
});

router.get('/signup', (req, res) => {
    res.render('signup', {layout: 'auth'});
});

router.post('/signin', async function (req, res) {
    let user = await User.findOne({email: req.body.email});

    if (!user) {
        res.status(401).send({ success: false, msg: 'Authentication failed. User not found.' });
    } else {
        // check if password matches
        user.comparePassword(req.body.password, function (err, isMatch) {
            if (isMatch && !err) {
                // if user is found and password is right create a token
                var token = jwt.sign(user.toJSON(), config.secret,  { expiresIn: '30m' } );
                req.session.accessToken = token;
                // res.json({ success: true, token: 'JWT ' + token, session: req.session });
                res.redirect('/')
            } else {
                res.status(401).send({ success: false, msg: 'Authentication failed. Wrong password.' });
            }
        });
    }
});


router.post('/createBook', authMiddleware.verifyToken, function (req, res) {
        console.log(req.body);
        var newBook = new Book({
            isbn: req.body.isbn,
            title: req.body.title,
            author: req.body.author,
            publisher: req.body.publisher
        })

        newBook.save().then( () => {
            res.redirect('/api/book')
        })
            
            // res.json({ success: true, msg: 'Successful created new book.' });
          
        
});


router.get('/book', authMiddleware.verifyToken , async function (req, res) {
        let books = await Book.find().lean();
        // res.json(books);
        res.render('books/index', { books: books});
});

router.get('/createBook', authMiddleware.verifyToken , async function (req, res) {
    res.render('books/create');
});

getToken = function (headers) {
    if (headers && headers.authorization) {
        var parted = headers.authorization.split(' ');
        if (parted.length === 2) {
            return parted[1];
        } else {
            return null;
        }
    } else {
        return null;
    }
};

module.exports = router;
