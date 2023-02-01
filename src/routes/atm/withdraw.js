// routes/atm/withdraw.js
const express = require('express');
const router = express.Router();
const short_uuid = require('short-uuid');
const db = require('../../config/db.config');

// import middleware
const authMiddleware = require('../../middleware/auth.middleware');

// @route GET /atm/withdraw
// @description Withdraw Money Page
// @access User
router.get('/withdraw', authMiddleware.isLoggedIn(), (req, res) => {
  const { balance } = req.user;

  res.render('withdraw', {
    balance: balance
  });
});

// @route POST /atm/withdraw
// @description Submit Withdraw Money form
// @access User
router.post('/withdraw', authMiddleware.isLoggedIn(), (req, res) => {
  const { account_id, balance } = req.user;
  const { withdraw_amount } = req.body;

  if (withdraw_amount > balance) {
    res.render('withdraw', {
      balance: balance,
      withdrawError: 'You have insufficient balance!'
    });
  } else if (withdraw_amount <= 0) {
    res.render('withdraw', {
      balance: balance,
      withdrawError: 'Withdraw Amount cannot be negative or zero'
    });
  } else {
    db.getConnection((err, conn) => {
      const script = `SELECT balance FROM Accounts WHERE account_id = '${account_id}'`;
      conn.query(script, (err, result) => {
        if (err) {
          res.render('withdraw', {
            balance: balance,
            depositError: 'Unable to withdraw. Please try again later!'
          });
        } else {
          const fetchedBalance = result[0].balance;
          const finalBalance = parseFloat(fetchedBalance) - parseFloat(withdraw_amount);
          const trnx_id = short_uuid.generate();
          const trnx_date = new Date().toISOString().slice(0, 19).replace('T', ' ');
          const sql = `INSERT INTO Transaction 
          (trnx_id, amount, balance, trnx_date, account_id, trnx_type)
          VALUES
          ('${trnx_id}', '${withdraw_amount}', ${finalBalance}, '${trnx_date}', '${account_id}', ${2});`;
          conn.execute(sql, (err, executeResult) => {
            if (err) {
              res.render('deposit', {
                balance: balance,
                depositError: 'Unable to deposit. Please try again later!'
              });
            } else {
              req.session.withdrawSuccess = `You have withdrawn an amount of ${withdraw_amount} successfully!`;
              res.redirect('/profile');
            }
          })
        }
      })
      db.releaseConnection(conn);
    });
  }
});

module.exports = router;