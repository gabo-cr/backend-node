const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const helmet = require('helmet');
const nunjucks = require('nunjucks');
const jwtAuth = require('./lib/jwtAuthMiddleware');
const i18n = require('./lib/i18nConfig');

require('./lib/connectMongoose');

const app = express();

// view engine setup
nunjucks.configure('views', {
  autoescape: true,
  express: app
});
app.set('view engine', 'njk');

/**
 * Middlewares
 */
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(helmet());

/**
 * Rutas del API
 */
app.use('/api', require('./routes/api/index'));
app.use('/api/authenticate', require('./routes/api/authenticate'));
app.use('/api/anuncios', jwtAuth, require('./routes/api/anuncios'));
app.use('/api/tags', jwtAuth, require('./routes/api/tags'));

/**
 * Rutas del Website
 */
app.use(i18n.init);
app.use('/', require('./routes/index'));
app.use('/change-locale', require('./routes/locale'));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // errores de validación
  if (err.array) {
    const errInfo = err.array({ })[0];
    console.log(errInfo);
    err.message = `Not valid - ${errInfo.type} ${errInfo.path} in ${errInfo.location} ${errInfo.msg}`;
    err.status = 422;
  }

  res.status(err.status || 500);

  // si el fallo es en el API, responder en formato JSON
  if (req.originalUrl.startsWith('/api/')) {
    res.json({ error: err.message });
    return;
  }

  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.render('error');
});

module.exports = app;
