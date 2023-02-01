const mysql = require('mysql2');

const dbOptions = require('./dbOptions.config');

const connectionPool = mysql.createPool(dbOptions);

module.exports = connectionPool;