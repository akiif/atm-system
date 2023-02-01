// import modules
const passport = require('passport');
const bcrypt = require('bcrypt');
const localStrategy = require('passport-local').Strategy;
const db = require('./db.config');

module.exports = (passport) => {
  passport.use(
    new localStrategy((username, password, done) => {
      db.getConnection((err, conn) => {
        const sql = `SELECT * FROM Accounts WHERE username = '${username}' LIMIT 1`;
        conn.query(sql, async (err, userArray) => {
          if (err) throw err;
          const user = userArray[0];
          if (!user || user == null || user == undefined) {
            return done(null, "no-user");
          } else {
            bcrypt.compare(password, user.password, (err, result) => {
              if (err) {return done(err)}
              if (result === true) {return done(null, user)}
              else {return done(null, false);}
            });
          }
        });
        db.releaseConnection(conn);
      })
    })
  );
}

// To use with sessions
passport.serializeUser((user, cb) => {
  cb(null, user.account_id);
});

passport.deserializeUser((id, cb) => {
  db.getConnection((err, conn) => {
    const sql = `SELECT * FROM Accounts 
    JOIN Account_Types ON Accounts.account_type=Account_Types.account_type_id
    WHERE Accounts.account_id = '${id}'`
    conn.query(sql, async (err, user) => {
      if (err) {return cb(err)}
      cb(err, user[0])
    });
    db.releaseConnection(conn);
  });
});