var
  express = require('express'),
  expressValidator = require('express-validator'),
  path = require('path'),
  pug = require('pug'),
  logger = require('morgan'),
  cookieParser = require('cookie-parser'),
  session = require('express-session'),
  passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy,
  bodyParser = require('body-parser'),
  multer = require('multer'),
  upload = multer({dest: './uploads'}),
  flash = require('connect-flash'),
  {mongoose} = require('./db/mongoose.js'),
  index = require('./routes/index'),
  user = require('./routes/users'),
  app = express(),
  port = process.env.PORT || 3000;

app.set('view engine', 'pug');


// uncomment after placing your favicon in /public
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Handle Express Sessions

app.use(session({
  secret: 'secret',
  saveUninitialized: true,
  resave: true
}));

// Passport

app.use(passport.initialize());
app.use(passport.session());

// Validator

app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
    var namespace = param.split('.'),
    root = namespace.shift(),
    formParam = root;
    while(namespace.length) {
      formParam +='[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg : msg,
      value: value
    };
  }
}));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(flash());
app.use(function(req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

app.use('/', index);
app.use('/users', user);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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

app.listen(port, function() {
    console.log(`Server is up on port ${port}`);
});
