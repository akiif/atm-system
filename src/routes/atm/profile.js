// routes/atm/profile.js
const express = require('express');
const router = express.Router();

// import middleware
const authMiddleware = require('../../middleware/auth.middleware');

const getFormattedDate = (rawDate) => {
  const isoDate = new Date(rawDate);
  let formattedDate = (  new Date( isoDate.getTime() + Math.abs(isoDate.getTimezoneOffset()*60000) )  );
  return formattedDate = formattedDate.toJSON().slice(0,10).split('-').reverse().join('/');
}

// @route GET /profile
// @description Profile Page
// @access User
router.get('/profile', authMiddleware.isLoggedIn(), (req, res) => {
  const { account_id, username, email_id, balance, name, type_name, dob, phno } = req.user;
  let formattedDOB = getFormattedDate(dob);
  
  const loginSuccess = req.session.loginSuccess;
  delete req.session.loginSuccess;

  const withdrawSuccess = req.session.withdrawSuccess;
  delete req.session.withdrawSuccess;

  const depositSuccess = req.session.depositSuccess;
  delete req.session.depositSuccess;

  const editProfileSuccess = req.session.editProfileSuccess;
  delete req.session.editProfileSuccess;

  const userDetails = {
    account_id: account_id,
    username: username,
    email_id: email_id,
    name: name,
    balance: balance,
    account_type: type_name,
    dob: formattedDOB,
    phno: phno
  }
  res.render('profile', {
    ...userDetails,
    loginSuccess: loginSuccess,
    withdrawSuccess: withdrawSuccess,
    depositSuccess: depositSuccess,
    editProfileSuccess: editProfileSuccess
  });
});

module.exports = router;