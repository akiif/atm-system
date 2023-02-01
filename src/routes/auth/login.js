// routes/auth/login.js
const express = require('express');
const router = express.Router();
const passport = require('passport');

// import middleware
const authMiddleware = require('../../middleware/auth.middleware');

// @route GET login/
// @description test login page
// @access Public
router.get('/login', (req, res) => {
  if (req.isAuthenticated()) {return res.redirect('/profile');}

  const { authError, registerSuccess, logoutSuccess } = req.query;
  res.render('login', {
    authError: authError,
    registerSuccess: registerSuccess,
    logoutSuccess: logoutSuccess
  });
});

// @route POST login/
// @description submit login request
// @access Public
router.post('/login', (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      console.log(err);
      let errorMessages = ['Unable to login, Please try again later...'];
      res.render('login', {
        errorMessages: errorMessages
      });
    }
    if (user === 'no-user') {
      let errorMessages = ['No account exists with the given username.'];
      res.render('login', {
        errorMessages: errorMessages
      });
    } else if (user === false) {
      let errorMessages = ['Incorrect Password.'];
      res.render('login', {
        errorMessages: errorMessages
      });
    } else {
      req.logIn(user, err => {
        if (err) {
          let errorMessages = ['Unable to login, Please try again later...'];
          res.render('login', {
            errorMessages: errorMessages
          });
        }
        if (req.isAuthenticated()) {
          req.session.loginSuccess = "You have logged in successfully!";
          res.redirect('/profile');
        } else {
          let errorMessages = ['Unable to login, Please try again later...'];
          res.render('login', {
            errorMessages: errorMessages
          });
        }
      })
    }
  })(req,res,next);
});

// @route GET login/test
// @description test login success
// @access User
router.get('/login/test', authMiddleware.isLoggedIn(), (req, res) => {
  res.send(`<h1>Hello ${req.user.name}!</h1> 
  <h3>Your Bank Account Number is: ${req.user.account_id}</h3>
  <h3>Your balance is: ${req.user.balance}</h3>
  <h3>Your username: is ${req.user.username}</h3>
  <a href="/logout">Logout</a>`);
});


module.exports = router;