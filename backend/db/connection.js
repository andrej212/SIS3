const mysql = require("mysql2");
require("dotenv").config();

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT || 3307,
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false
});


connection.connect((err) => {
    if (err) {
        console.log("DB ERROR:", err.message);
        return;
    }
    console.log("Connected to MySQL database!");
});

module.exports = connection;