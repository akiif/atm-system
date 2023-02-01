// routes/atm/transactions.js
const express = require('express');
const router = express.Router();
const db = require('../../config/db.config');

// import middleware
const authMiddleware = require('../../middleware/auth.middleware');

// @route GET /atm/transactions
// @description list user transactions page
// @access User
router.get('/transactions', authMiddleware.isLoggedIn(), (req, res) => {
  const { account_id, type_name, balance } = req.user;
  const accountDetails = { account_id, account_type: type_name, balance };

  db.getConnection((err, conn) => {
    const sql = `SELECT * FROM Transaction
    JOIN Transaction_Types ON Transaction.trnx_type=Transaction_Types.trnx_type_id
    WHERE Transaction.account_id='${account_id}' ORDER BY Transaction.trnx_date DESC;`;
    conn.query(sql, (err, transactions) => {
      if (err) {
        res.redirect('/profile');
      } else {
        res.render('transactions', {
          ...accountDetails,
          transactions: transactions
        });  
      }
    });
    db.releaseConnection(conn);
  });
});

module.exports = router;