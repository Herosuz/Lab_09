var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const { default: mongoose } = require('mongoose');

var farmRouter = require('./Farm'); // Updated require for the new Farm.js file

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// connect to mongodb
mongoose
  .connect('mongodb://127.0.0.1:27017/Demo', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('>>>>>>>>>> DB Connected!!!!!!'))
  .catch((err) => console.log('>>>>>>>>> DB Error: ', err));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// http:localhost:3000/farm (updated route)
app.use('/farm', farmRouter); 

app.get('/events/add', (req, res) => {
  res.render('add');
});

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/events/delete', (req, res) => {
  res.render('delete');
});

app.get('/events/update', (req, res) => {
  res.render('update');
});

app.get('/events/list', (req, res) => {
  res.render('list');
});

app.get('/events/find', (req, res) => {
  res.render('find');
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;