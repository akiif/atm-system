// routes/atm/home.js
const express = require('express');
const router = express.Router();

// @route GET /
// @description Home Page
// @access Public
router.get('/', (req, res) => {
  const { logoutSuccess } = req.query;

  if (req.isAuthenticated()) {
    res.redirect('profile');
  } else {
    res.render('home', { logoutSuccess: logoutSuccess });
  }
});

module.exports = router;