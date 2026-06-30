const mysql = require("mysql2");

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,

    ssl: {
        rejectUnauthorized: false
    },

    waitForConnections: true,
    connectionLimit: 5,
    queueLimit: 0
});

pool.getConnection((err, connection) => {
    if (err) {
        console.log("DB ERROR:", err.message);
    } else {
        console.log("MYSQL CONNECTED");
        connection.release();
    }
});

module.exports = pool;
