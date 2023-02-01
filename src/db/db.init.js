const db = require('../config/db.config');

db.getConnection((err, conn) => {
  // Account_Types Table
  let sql = `
  CREATE TABLE IF NOT EXISTS Account_Types (
    account_type_id     INTEGER NOT NULL AUTO_INCREMENT,
    type_name           VARCHAR(50) NOT NULL,
  
    PRIMARY KEY(account_type_id)
  );`;
  conn.execute(sql, (err, result) => {
    if (err) { console.log(err); }
    else {
      console.log("Account_Types Table Created Successfully");
    }
  });

  // Account_Types Data
  sql = `INSERT INTO Account_Types (type_name) VALUES ('Savings');`;
  conn.execute(sql, (err, result) => {
    if (err) { console.log(err); }
    else {
      console.log("Sample Data added to Account_Types Table");
    }
  });

  sql = `INSERT INTO Account_Types (type_name) VALUES ('Current');`;
  conn.execute(sql, (err, result) => {
    if (err) { console.log(err); }
    else {
      console.log("Sample Data added to Account_Types Table");
    }
  });

  sql = `INSERT INTO Account_Types (type_name) VALUES ('Salary');`;
  conn.execute(sql, (err, result) => {
    if (err) { console.log(err); }
    else {
      console.log("Sample Data added to Account_Types Table");
    }
  });

  sql = `INSERT INTO Account_Types (type_name) VALUES ('Fixed Deposit');`;
  conn.execute(sql, (err, result) => {
    if (err) { console.log(err); }
    else {
      console.log("Sample Data added to Account_Types Table");
    }
  });

  sql = `INSERT INTO Account_Types (type_name) VALUES ('Recurring Deposit');`;
  conn.execute(sql, (err, result) => {
    if (err) { console.log(err); }
    else {
      console.log("Sample Data added to Account_Types Table");
    }
  });

  // Accounts Table
  sql = `
  CREATE TABLE IF NOT EXISTS Accounts (
    account_id      VARCHAR(255) NOT NULL UNIQUE,
    username        VARCHAR(35) NOT NULL UNIQUE,
    email_id        VARCHAR(35) NOT NULL UNIQUE,
    name            VARCHAR(80),
    password        VARCHAR(255),
    phno            VARCHAR(15) NOT NULL,
    dob             DATE NOT NULL,
    balance         DOUBLE DEFAULT 0,
    account_type    INTEGER,
  
    INDEX (username),
  
    PRIMARY KEY (account_id),
  
    CONSTRAINT FOREIGN KEY (account_type) REFERENCES Account_Types (account_type_id)
      ON DELETE CASCADE ON UPDATE CASCADE
  );
  `;
  conn.execute(sql, (err, result) => {
    if (err) { console.log(err); }
    else {
      console.log("Accounts Table Created Successfully");
    }
  });

  // Transaction_Types Table
  sql = `
  CREATE TABLE IF NOT EXISTS Transaction_Types (
    trnx_type_id      INTEGER NOT NULL AUTO_INCREMENT,
    type_name         VARCHAR(20) NOT NULL,
  
    PRIMARY KEY (trnx_type_id)
  );
  `;
  conn.execute(sql, (err, result) => {
    if (err) { console.log(err); }
    else {
      console.log("Transaction_Types Table Created Successfully");
    }
  });

  // Transaction_Types Data
  sql = `INSERT INTO Transaction_Types (type_name) VALUES ('CREDIT');`;
  conn.execute(sql, (err, result) => {
    if (err) { console.log(err); }
    else {
      console.log("Sample Data added to Transaction_Types Table");
    }
  });

  sql = `INSERT INTO Transaction_Types (type_name) VALUES ('DEBIT');`
  conn.execute(sql, (err, result) => {
    if (err) { console.log(err); }
    else {
      console.log("Sample Data added to Transaction_Types Table");
    }
  });

  sql = `
  CREATE TABLE IF NOT EXISTS Transaction (
    trnx_id         VARCHAR(100) NOT NULL UNIQUE,
    amount          DOUBLE,
    balance         DOUBLE,
    trnx_date       DATETIME NOT NULL,
    account_id      VARCHAR(255) NOT NULL,
    trnx_type       INTEGER NOT NULL,
    
    PRIMARY KEY (trnx_id),
  
    CONSTRAINT FOREIGN KEY (account_id) REFERENCES Accounts (account_id)
      ON DELETE CASCADE ON UPDATE CASCADE,
  
    CONSTRAINT FOREIGN KEY (trnx_type) REFERENCES Transaction_Types (trnx_type_id)
      ON DELETE CASCADE ON UPDATE CASCADE
  );
  `;
  conn.execute(sql, (err, result) => {
    if (err) { console.log(err); }
    else {
      console.log("Transaction Table Created Successfully");
    }
  });

  // new_transaction Trigger
  sql = 'CREATE TRIGGER new_transaction ' +
  ' AFTER INSERT ON Transaction' + 
  ' FOR EACH ROW' +
  ' BEGIN' +
  ' UPDATE Accounts SET Accounts.balance = NEW.balance WHERE Accounts.account_id = NEW.account_id;' +
  'END;';
  
  conn.query(sql, (err, result) => {
    if (err) { console.log(err); }
    else {
      console.log("new_transaction Trigger Created Successfully");
    }
    process.exit(0);
  });

  db.releaseConnection(conn);
});