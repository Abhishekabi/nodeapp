var express = require('express');
var passport = require('passport');
var Strategy = require('passport-facebook').Strategy;
var port = process.env.PORT || 3000;

let app = express();

passport.use(
  new Strategy(
    {
      clientID: '2340711832665460',
      clientSecret: '0f5e0079c6e7ff82107e951b4cb392ef',
      callbackURL: 'http://localhost:3000/login/facebook/return'
    },
    (accessToken, refreshToken, profile, cb) => {
      return cb(null, profile);
    }
  )
);

passport.serializeUser((user, cb) => {
  cb(null, user);
});

passport.deserializeUser((obj, cb) => {
  cb(null, obj);
});

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(require('morgan')('combined'));
app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(
  require('express-session')({
    secret: 'abc corp',
    resave: true,
    saveUninitialized: true
  })
);

// @route  - GET  /home
// @desc   - A route to home page
// @access - PUBLIC
app.get('/', (req, res) => {
  res.render('home', {
    user: req.user
  });
});

// @route  - GET  /login
// @desc   - A route to login page
// @access - PUBLIC
app.get('/login', (req, res) => {
  res.render('login');
});

// @route  - GET  /login/facebook
// @desc   - A route to facebook auth
// @access - PUBLIC
app.get('/login/facebook', passport.authenticate('facebook'));

// @route  - GET  /login/facebook/callback
// @desc   - A route to facebook login
// @access - PUBLIC
app.get(
  '/login/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  (req, res) => {
    // Successful authentication, redirect home.
    res.redirect('/');
  }
);

// @route  - GET  /profile
// @desc   - A route to user profile
// @access - PRIVATE
app.get(
  '/profile',
  require('connect-ensure-login').ensureLoggedIn(),
  (req, res) => {
    res.render('profile', { user: req.user });
  }
);

app.listen(port, () => console.log('server running at port 3000...'));
