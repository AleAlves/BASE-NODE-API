const port = process.env.PORT || 8083;

const databaseURI = process.env.DB_TOKEN_URI || 'mongodb://localhost:27017/db';

const createError = require('http-errors');

const express = require('express');

const path = require('path');

const cookieParser = require('cookie-parser');

const methodOverride = require('method-override');

const logger = require('morgan');

const load = require('express-load');

const mongoose = require('mongoose');

const bodyParser = require('body-parser');

const app = express();

global.packageInfo = require('./package.json');

global.HTTP_STATUS = require('./httpStatus.json');

process.env.TZ = 'America/Sao_Paulo';

//Database

mongoose.connect(databaseURI, {
    useNewUrlParser: true,
    useCreateIndex: true
  },
  err => {
    if (err) {
      throw err;
      console.log(`could not connect to database.`);
    }
  }
);
global.db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log('Connected to mongo DB');
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(logger('dev'));
app.use(cookieParser());
app.use(express.json());
app.use(methodOverride('_method'));
app.use(express.urlencoded({
  extended: false
}));
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

load('utils').then('security').then('models').then('controllers').then('routes').into(app);

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

app.listen(port, function () {
  console.log("Listening to " + port);
});

module.exports = app;