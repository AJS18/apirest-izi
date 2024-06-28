const mysql = require('mysql2');

var pool = mysql.createPool({
    "user": "root",
    "password": "123456",
    "database": "prod",
    "host": "localhost",
    "port": 3306
});

module.exports.pool = pool;