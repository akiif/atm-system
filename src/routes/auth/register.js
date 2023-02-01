// routes/auth/register.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../../config/db.config');
const { v4: uuidv4 } = require('uuid');
const querystring = require('node:querystring');

const getAccountTypes = (conn, callback) => {
  const sql = 'SELECT * FROM Account_Types;';
  conn.query(sql, (err, result) => {
    if (err) {throw err}
    callback(result)
  });
}

// @route GET register
// @description register form page
// @access Public
router.get('/register', (req, res) => {
  if (req.isAuthenticated()) {return res.redirect('/profile');}

  db.getConnection(async (err, conn) => {
    getAccountTypes(conn, (account_types) => {
      res.render('register', {
        account_types: account_types
      });
    })
    db.releaseConnection(conn);
  });
});

// @route POST register
// @description submit register form
// @access Public
router.post('/register', (req, res) => {
  const account_id = uuidv4();
  const { username, email_id, name, password, phno, dob, account_type } = req.body;
  
  db.getConnection(async (err, conn) => {
    const script = `SELECT * FROM Accounts WHERE username='${username}' OR email_id='${email_id}';`
    conn.query(script, async (err, result) => {
      if (result.length > 0) {
        console.log("User already Present");
        let errorMessages = [];
        console.log(result[0].username);
        if (result[0].username == username) errorMessages.push('Username Already Taken');
        if (result[0].email_id == email_id) errorMessages.push('Email ID Already Taken');
        getAccountTypes(conn, (account_types) => {
          res.render('register', {
            account_types: account_types,
            errorMessages: errorMessages
          });
        })
      } else {
        console.log("No users Present");
        const hashPassword = await bcrypt.hash(password, 10);
        const sql = `INSERT INTO Accounts 
        (account_id, username, email_id, name, password, phno, dob, balance, account_type)
        VALUES
        ('${account_id}', '${username}', '${email_id}',  '${name}',
        '${hashPassword}', '${phno}', '${dob}', ${0.0}, ${account_type});`
        conn.execute(sql, async (err, result) => {
          if (err) {
            throw err;
          } else {
            db.releaseConnection(conn);
            const query = querystring.stringify({
              "registerSuccess": "New account created successfully! Login to continue."
            });
            res.redirect('/login?' + query);
          }
        });
      }
    })
  });
});

module.exports = router;