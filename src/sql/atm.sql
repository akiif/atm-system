CREATE DATABASE IF NOT EXISTS atm_system;

USE atm_system;

-- -----------------------------------------------------
-- Table `atm_system`.`Account_Types`
-- -----------------------------------------------------

CREATE TABLE IF NOT EXISTS Account_Types (
  account_type_id     INTEGER NOT NULL AUTO_INCREMENT,
  type_name           VARCHAR(50) NOT NULL,

  PRIMARY KEY(id)
);

INSERT INTO Account_Types (type_name) VALUES ('Savings');
INSERT INTO Account_Types (type_name) VALUES ('Current');
INSERT INTO Account_Types (type_name) VALUES ('Salary');
INSERT INTO Account_Types (type_name) VALUES ('Fixed Deposit');
INSERT INTO Account_Types (type_name) VALUES ('Recurring Deposit');


-- -----------------------------------------------------
-- Table `atm_system`.`Accounts`
-- -----------------------------------------------------

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

-- -----------------------------------------------------
-- Table `atm_system`.`Transaction_Types`
-- -----------------------------------------------------

CREATE TABLE IF NOT EXISTS Transaction_Types (
  trnx_type_id      INTEGER NOT NULL AUTO_INCREMENT,
  type_name         VARCHAR(20) NOT NULL,

  PRIMARY KEY (trnx_type_id)
);

INSERT INTO Transaction_Types (type_name) VALUES ('CREDIT');
INSERT INTO Transaction_Types (type_name) VALUES ('DEBIT');

-- -----------------------------------------------------
-- Table `atm_system`.`Transaction`
-- -----------------------------------------------------

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


-- -----------------------------------------------------
-- Trigger `atm_system`.`new_transaction`
-- -----------------------------------------------------

CREATE TRIGGER new_transaction
AFTER INSERT ON Transaction
FOR EACH ROW
UPDATE Accounts
SET Accounts.balance = NEW.balance
WHERE Accounts.account_id = NEW.account_id;