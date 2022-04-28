var createError = require('http-errors');
console.log(__dirname);
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var passport = require('passport');
const mongoose = require('mongoose');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var projectRouter = require('./routes/projectRouter');
var dataRouter = require('./routes/dataRouter')
var authenticate = require('./authenticate');
var config = require("./config");

// setting up mongo connecttion
const url = config.mongoUrl;
const connect = mongoose.connect(url);
connect.then((db) => {
  console.log("Connected correctly to server");
},(err) => { console.log(err); });

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// express defaults
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// setting up passport
app.use(passport.initialize());

// Routers
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/projects',projectRouter);
app.use('/data',dataRouter);
// app.use('/projects/:prId/experiments/:experimentId/run-experiment',runExperiment);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
