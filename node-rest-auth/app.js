//var createError = require('http-errors');
var express = require('express');
const session = require('express-session');
const hbs = require('express-handlebars');
const path = require('path');
const bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var config = require('./config/database');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var apiRouter = require('./routes/api');

const app = express();
app.use(session({
  resave: true, 
  saveUninitialized: true, 
  secret: 'somesecret', 
  cookie: { maxAge: 600000 }}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/', express.static(path.join(__dirname, 'public')));
app.use('/api', apiRouter);
app.engine('handlebars', hbs.engine({
  extname: 'handlebars',
  helpers: {
    inc: function(target) {
      return parseInt(target) + 1;
    },
    eq: function(target, value) {
      return value === target
    }
  }
}))
app.set('view engine', 'handlebars');
app.set('views', './views');

mongoose.connect(config.database, { useNewUrlParser: true, useUnifiedTopology: true });

// var cors = require('cors')

// app.use(cors());

app.use(passport.initialize());


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  console.log('404 - Khong tim thay trang')
  next();
});

module.exports = app;

const port = 3000;

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});
