var express = require('express');
var cors = require('cors');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var scanRouter = require('./routes/scan');
var redsRouter = require('./routes/redisTest')

var app = express();
app.use(cors({origin:'*'}))
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/scan', scanRouter);
app.use('/InventoryTemp',redsRouter);

module.exports = app;
