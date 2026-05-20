const mysql = require("mysql2");
require("dotenv").config();

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: undefined,
    database: process.env.DB_DATABASE,
    port: 3307
});

connection.connect((err) => {
    if (err) {
        console.log("DB ERROR:", err.message);
        return;
    }
    console.log("Connected to MySQL database!");
});

module.exports = connection;