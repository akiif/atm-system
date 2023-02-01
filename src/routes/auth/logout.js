// routes/auth/logout.js
const express = require('express')
const router = express.Router();
const querystring = require('node:querystring');

// @route GET logout
// @description logout user
// @access User
router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      console.log(err);
      res.redirect('/login/test');
    } else {
      req.session.destroy();
      const query = querystring.stringify({
        "logoutSuccess": "You have logged out successfully!"
      });
      res.redirect('/?' + query);
    }
  })
})

module.exports = router;