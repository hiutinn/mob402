const express = require('express');
const bodyParser = require('body-parser');
const { add, substract, multiply, devide } = require('./calculator');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
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
    res.write('<h1>Result: ' + result + '</h1>')
})

app.listen(8080);