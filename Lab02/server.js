const express = require('express');
const bodyParser = require('body-parser');
const { add, substract, multiply, devide } = require('./calculator');
const ejs = require('ejs');

const app = express();
app.engine('html', ejs.renderFile)
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function (req, res) {
    res.render(__dirname + '/index.html', {result: 0});
});

app.post('/', function (req, res) {
    const num1 = Number(req.body.num1);
    const num2 = Number(req.body.num2);

    const operator = req.body.operator;
    var result = 0;
    switch (operator) {
        case "+":
            result = add(num1, num2);
            break;
        case "-":
            result = substract(num1, num2);
            break;
        case "*":
            result = multiply(num1, num2);
            break;
        case "/":
            result = devide(num1, num2);
            break;
    }
    // console.log(result);
    res.render(__dirname + '/index.html', {result: result});
})

app.listen(8080);