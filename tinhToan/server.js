const express = require('express');
const bodyParser = require('body-parser');
const { add, substract, multiply, devide } = require('./calculator');
const handlebars = require('express-handlebars');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.engine('.hbs', handlebars.engine({
    extname: 'hbs',
    helpers: {
        eq : function(operator, value) {
            return operator == value
        }
    }
}))
app.set('view engine', '.hbs');
app.set('views', './views');

app.get('/', function (req, res) {
    res.render('index', {result: 0});
});

app.post('/', function (req, res) {
    const num1 = Number(req.body.num1);
    const num2 = Number(req.body.num2);

    const operator = req.body.operator;
    var result = 0;
    var temp = {}
    switch (operator) {
        case "+":
            result = add(num1, num2);
            // temp = {add: true}
            break;
        case "-":
            result = substract(num1, num2);
            // temp = {substract: true}
            break;
        case "*":
            result = multiply(num1, num2);
            // temp = {multiply: true}
            break;
        case "/":
            result = devide(num1, num2);
            break;
    }
    // console.log(result);
    res.render('index', {num1: num1,num2: num2 ,result: result,operator: operator});
})

app.listen(8080);