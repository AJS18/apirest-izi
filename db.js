const Pool = require('pg').Pool;

const pool = new Pool({
    user: "postgres",
    host: "database-1.cju4sysyizxw.us-east-2.rds.amazonaws.com",
    database: "database-1",
    password: "senhaBANCOIZI",
    port: 5432
});

module.exports = pool;