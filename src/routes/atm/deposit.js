// routes/atm/deposit.js
const express = require('express');
const router = express.Router();
const short_uuid = require('short-uuid');
const db = require('../../config/db.config');

// import middleware
const authMiddleware = require('../../middleware/auth.middleware');

// @route GET /atm/deposit
// @description Deposit Money Page
// @access User
router.get('/deposit', authMiddleware.isLoggedIn(), (req, res) => {
  const { balance } = req.user;
  res.render('deposit', {
    balance: balance
  });
});

// @route POST /atm/deposit
// @description Submit Deposit Money Form
// @access User
router.post('/deposit', authMiddleware.isLoggedIn(), (req, res) => {
  const { deposit_amount } = req.body;
  const { account_id, balance } = req.user;

  if (deposit_amount <= 0) {
    res.render('deposit', {
      balance: balance,
      depositError: 'Deposit amount cannot be zero or negative!'
    });
  } else {
    db.getConnection((err, conn) => {
      const script = `SELECT balance FROM Accounts WHERE account_id = '${account_id}'`;
      conn.query(script, (err, result) => {
        if (err) {
          res.render('deposit', {
            balance: balance,
            depositError: 'Unable to deposit. Please try again later!'
          });
        } else {
          const fetchedBalance = result[0].balance;
          const finalBalance = parseFloat(fetchedBalance) + parseFloat(deposit_amount);
          const trnx_id = short_uuid.generate();
          const trnx_date = new Date().toISOString().slice(0, 19).replace('T', ' ');
          const sql = `INSERT INTO Transaction 
          (trnx_id, amount, balance, trnx_date, account_id, trnx_type)
          VALUES
          ('${trnx_id}', '${deposit_amount}', ${finalBalance}, '${trnx_date}', '${account_id}', ${1});`;
          conn.execute(sql, (err, executeResult) => {
            if (err) {
              res.render('deposit', {
                balance: balance,
                depositError: 'Unable to deposit. Please try again later!'
              });
            } else {
              req.session.depositSuccess = `You have deposited an amount of ${deposit_amount} successfully!`;
              res.redirect('/profile');
            }
          });
        }
      });
      db.releaseConnection(conn);
    });
  }
});


module.exports = router;