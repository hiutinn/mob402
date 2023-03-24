const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const hbs = require('express-handlebars');
const path = require('path');
const methodOverride = require('method-override');
const app = express();
const port = process.env.PORT || 5000;

// const clientProductRoutes = require('./routes/client/ProductRoute');
const adminProductRoutes = require('./routes/admin/ProductRoute');
const adminUserRoutes = require('./routes/admin/UserRoute');
const authRoutes = require('./routes/admin/AuthRoute');

app.use(methodOverride("_method"))
app.use('/',express.static(path.join(__dirname, 'public')));
// app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());

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

// app.use('/api/products', clientProductRoutes);
app.use('/admin/products', adminProductRoutes);
app.use('/admin/users', adminUserRoutes);
app.use('/admin/auth', authRoutes);

app.get('/', (req, res) => {
  res.render('auth/login', {layout: 'auth'});
})

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});