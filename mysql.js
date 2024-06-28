const mysql = require('mysql2');

var pool = mysql.createPool({
    "user": "rccfb18w7cyjpk6z",
    "password": "c75aes3qh0p1x7cu",
    "database": "qjru2cfyxstn7f6c",
    "host": "ysp9sse09kl0tzxj.cbetxkdyhwsb.us-east-1.rds.amazonaws.com	",
    "port": 3306
});

module.exports.pool = pool;