const express = require('express')
const hbs = require('express-handlebars')
const app = express()

app.engine('handlebars', hbs.engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

app.get('/', function (req, res) {
  res.render('index')
})

app.listen(3000)