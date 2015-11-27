'use strict';

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

var routes = require('./routes/index');
var users = require('./routes/users');
var verk = require('./routes/verk');

var viewCounter = require('./middleware/viewCounter');
var errorHandler = require('./middleware/errorHandler');
var notFoundHandler = require('./middleware/notFoundHandler');

var app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.engine('.html',require('jade').renderFile);
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(cookieParser());

var cookie = { domain: '',
               httpOnly: false,
               secure: false };

app.use(session({
  secret: 'session secret!',
  resave: false,
  saveUninitialized: true,
  cookie: cookie,
  name: 'session'
}));

app.use('/', routes);
app.use('/', users);
app.use('/', verk);


app.use(notFoundHandler);
app.use(errorHandler);


module.exports = app;
