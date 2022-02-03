var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var loginRouter = require('./routes/login');

var app = express();

app.all('*', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', 'http://localhost:8080');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Access-Control-Allow-Methods', 'OPTIONS,POST,GET');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Content-Type', 'application/json;charset=utf-8');
    if (req.method.toLocaleLowerCase() === 'options') {
        res.send(200)
    } else {
        next();
    }
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/user', loginRouter);

module.exports = app;
