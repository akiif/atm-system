// routes/atm/editProfile.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../../config/db.config');

// import middleware
const authMiddleware = require('../../middleware/auth.middleware');

// @route GET /profile/edit
// @description edit profile form page
// @access User
router.get('/profile/edit', authMiddleware.isLoggedIn(), (req, res) => {
  const { username, email_id, phno } = req.user;
  res.render('editProfile', {
    username: username,
    email_id: email_id,
    phno: phno
  });
});


// @route POST /profile/edit
// @description submit register form
// @access User
router.post('/profile/edit', authMiddleware.isLoggedIn(), async (req, res) => {
  const { account_id } = req.user;
  const profileDetails = {
    username: req.user.username,
    email_id: req.user.email_id,
    phno: req.user.phno
  }
  const { username, email_id, old_password, new_password, phno } = req.body;
  const newHashedPassword = await bcrypt.hash(new_password, 10)
  let errorMessages = [];

  db.getConnection(async (err, conn) => {
    const passwordCheckScript = `SELECT * FROM Accounts WHERE account_id='${account_id}';`;
    conn.query(passwordCheckScript, (err, result) => {
      if (err) {throw err}
      bcrypt.compare(old_password, result[0].password, (err, bcryptResult) => {
        if (err) {
          errorMessages.push('Unable to check for authenticity of old password. Please try again later!');
          res.render('editProfile', { errorMessages: errorMessages, ...profileDetails });
        } else if (bcryptResult === false) {
          errorMessages.push('The Old Password that you have entered is incorrect.');
          res.render('editProfile', { errorMessages: errorMessages, ...profileDetails });
        } else {
          if (username !== req.user.username) {
            const usernameCheckScript = `SELECT * FROM Accounts WHERE username='${username}';`;
            conn.query(usernameCheckScript, async (err, usernameCheckResult) => {
              if (usernameCheckResult.length > 0) {
                errorMessages.push('The username entered already exists!');
                res.render('editProfile', { errorMessages: errorMessages, ...profileDetails });
              } else {
                if (email_id !== req.user.email_id) {
                  const emailCheckScript = `SELECT * FROM Accounts WHERE email_id='${email_id}';`;
                  conn.query(emailCheckScript, async (err, emailCheckResult) => {
                    if (emailCheckResult.length > 0) {
                      errorMessages.push('The email entered already exists!');
                      res.render('editProfile', { errorMessages: errorMessages, ...profileDetails });
                    } else {
                      const sql = `
                      UPDATE Accounts SET username='${username}', email_id='${email_id}', phno='${phno}', password='${newHashedPassword}' 
                      WHERE account_id='${account_id}';`;
                      conn.execute(sql, (err, result) => {
                        if (err) {
                          errorMessages.push('Unable to edit the profile details. Please Try Again later');
                          res.render('editProfile', { errorMessages: errorMessages, ...profileDetails });
                        } else {
                          req.session.editProfileSuccess = "Profile Details Edited Successfully!";
                          res.redirect('/profile');
                        }
                      });
                    }
                  });
                } else {
                  const sql = `
                    UPDATE Accounts SET username='${username}', phno='${phno}', password='${newHashedPassword}' 
                    WHERE account_id='${account_id}';`;
                  conn.execute(sql, (err, result) => {
                    if (err) {
                      console.log(err);
                      errorMessages.push('Unable to edit the profile details. Please Try Again later');
                      res.render('editProfile', { errorMessages: errorMessages, ...profileDetails });
                    } else {
                      req.session.editProfileSuccess = "Profile Details Edited Successfully!";
                      res.redirect('/profile');
                    }
                  });
                }
              }
            });
          } else {
            if (email_id !== req.user.email_id) {
              const emailCheckScript = `SELECT * FROM Accounts WHERE email_id='${email_id}';`;
              conn.query(emailCheckScript, async (err, emailCheckResult) => {
                if (emailCheckResult.length > 0) {
                  errorMessages.push('The email entered already exists!');
                  res.render('editProfile', { errorMessages: errorMessages, ...profileDetails });
                } else {
                  const sql = `
                  UPDATE Accounts SET email_id='${email_id}', phno='${phno}', password='${newHashedPassword}' 
                  WHERE account_id='${account_id}';`;
                  conn.execute(sql, (err, result) => {
                    if (err) {
                      errorMessages.push('Unable to edit the profile details. Please Try Again later');
                      res.render('editProfile', { errorMessages: errorMessages, ...profileDetails });
                    } else {
                      req.session.editProfileSuccess = "Profile Details Edited Successfully!";
                      res.redirect('/profile');
                    }
                  });
                }
              });
            } else {
              const sql = `
                UPDATE Accounts SET phno='${phno}', password='${newHashedPassword}' 
                WHERE account_id='${account_id}';`;
              conn.execute(sql, (err, result) => {
                if (err) {
                  errorMessages.push('Unable to edit the profile details. Please Try Again later');
                  res.render('editProfile', { errorMessages: errorMessages, ...profileDetails });
                } else {
                  req.session.editProfileSuccess = "Profile Details Edited Successfully!";
                  res.redirect('/profile');
                }
              });
            }
          }
        } 
      })
    });
    db.releaseConnection(conn);
  });
});

module.exports = router;