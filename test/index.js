const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
var passport = require('passport');
const bodyParser = require('body-parser');
const hbs = require('express-handlebars');
const path = require('path');
const dotenv = require('dotenv');
const methodOverride = require('method-override');
const app = express();
const port = process.env.PORT || 5000;
const clientProductRoute = require('./routes/client/ProductRoute');
const clientUserRoute = require('./routes/client/UserRoute');
const adminProductRoute = require('./routes/admin/ProductRoute');
const adminUserRoute = require('./routes/admin/UserRoute');
const authRoute = require('./routes/admin/AuthRoute');
const authCLientRoute = require('./routes/client/AuthRoute');
const authMiddleware = require('./middlewares/authMiddleware');

dotenv.config();
app.use(session({
  resave: true, 
  saveUninitialized: true, 
  secret: 'somesecret', 
  cookie: { maxAge: 600000 }}));
app.use(methodOverride("_method"));
// app.use(passport.initialize());
app.use('/',express.static(path.join(__dirname, 'public')));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// app.use(express.json());

app.engine('handlebars', hbs.engine({
  extname: 'handlebars',
  helpers: {
    inc: function(target) {
      return parseInt(target) + 1;
    },
    eq: function(target, value) {
      return value === target
    },
    gt: function(target, value) {
      return value > target
    }
  }
}))
app.set('view engine', 'handlebars');
app.set('views', './views');

// console.log(process.env.DATABASE_URL)
mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('MongoDB connected');
}).catch((error) => {
  console.log('MongoDB connection error:', error);
});

app.use('/api/products', clientProductRoute);
app.use('/api/users', clientUserRoute);
app.use('/api/auth', authCLientRoute);
// app.use('/api/brands', clientBrandRoute);
app.use('/admin/products', adminProductRoute);
app.use('/admin/users', adminUserRoute);
app.use('/auth', authRoute);

app.get('/',authMiddleware.verifyLogin, (req, res) => {
  const uId = req.userData.userId;
  res.redirect('/admin/users/profile/'+uId);
});

app.get('/error', (req, res) => {
  res.render('error');
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
