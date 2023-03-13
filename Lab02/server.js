const express = require('express');
const bodyParser = require('body-parser');
const { add, substract, multiply } = require('./calculator');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

app.post('/', function (req, res) {
    const num1 = req.body.num1;
    const num2 = req.body.num2;
    const operator = req.body.operator;
    var result = 0;
    console.log(typeof(operator))
    switch (operator) {
        case "+":
            result = Number(num1) + Number(num2);
            break;
        case "-":
            result = Number(num1) - Number(num2);
            break;
        case "*":
            result = Number(num1) * Number(num2);
            break;
    }
    // console.log(result);
    res.write('<h1>Result: ' + result +'</h1>')
})

app.listen(8080);