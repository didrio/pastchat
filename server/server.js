const express = require('express');
const colors = require('colors');
const path = require('path');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const passport = require('passport');
const postController = require('./database/post-controller.js');
const configAuth = require('../config/auth.js');

const SERVER_PORT = process.env.SERVER_PORT || 3000;
const env = process.env.NODE_ENV || 'development';

const app = express();

app.get('/comments/:videoId', postController.getComments, (req, res) => {
  res.send(res.locals.comments);
});

passport.serializeUser(function (user, cb) {
  cb(null, user);
  // return done(null, { firstName: 'Foo', lastName: 'Bar' });
});

passport.deserializeUser(function (obj, cb) {
  cb(null, obj);
  // return done(null, { firstName: 'Foo', lastName: 'Bar' });
});

passport.use(new GoogleStrategy({
  clientID: configAuth.googleAuth.clientID,
  clientSecret: configAuth.googleAuth.clientSecret,
  callbackURL: configAuth.googleAuth.callbackURL
},
  function (accessToken, refreshToken, profile, cb) {
    User.findOrCreate({ googleId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));

app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  function (req, res) {
    // Successful authentication
    res.redirect('/');
  });


if (env === 'development') {
  const webpack = require('webpack');
  const webpackDevMiddleware = require('webpack-dev-middleware');
  const webpackHotMiddleware = require('webpack-hot-middleware');
  const webpackConfig = require('../webpack.config');
  const config = Object.create(webpackConfig);

  config.devtool = 'eval-source-map';
  config.entry = [
    `webpack-hot-middleware/client?path=http://localhost:${SERVER_PORT}/__webpack_hmr`,
    './client/index.js'
  ];
  config.plugins.push(new webpack.HotModuleReplacementPlugin());

  const compiler = webpack(config);

  app.use(webpackDevMiddleware(compiler, {
    hot: true,
    filename: config.output.filename,
    publicPath: '/',
    stats: { colors: true }
  }));

  app.use(webpackHotMiddleware(compiler, {
    path: '/__webpack_hmr'
  }));
} else {
  app.use(express.static(path.join(__dirname, '../build')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../build', 'index.html'));
  });
}

app.listen(SERVER_PORT, () => console.log(`App listening on port ${SERVER_PORT}...`.green));