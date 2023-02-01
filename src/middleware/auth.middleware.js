const querystring = require('node:querystring');

module.exports.isLoggedIn = () => {
  return (req, res, next) => {
    if (req.isAuthenticated()) {
      return next()
    } else {
      const query = querystring.stringify({
        "authError": "You need to be Logged in to access this page!"
      })
      res.redirect('/login?' + query);
    }
  }
}