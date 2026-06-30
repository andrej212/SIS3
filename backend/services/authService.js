const db = require("../db/connection.js");

//za register
const createUser = (username,email, password) => {   
    const role = "user";
    return new Promise((resolve,reject)=>{
        db.query(`INSERT INTO users (username, email, password, role) VALUES (?,?,?,?)`,[username,email,password,role],(err,res)=>{
            if(err){return reject(err)}
            resolve(res);
        })
    });
}

//za login

const getUserByUsername = (username) => {
    return new Promise((resolve,reject)=>{
        db.query(`SELECT * FROM users WHERE username = ?`,[username],(err,res)=>{
            if(err){return reject(err)}
            resolve(res);
        })
    })
}

const createEmployee = (username, email, password) => {
    return new Promise((resolve, reject) => {
        db.query(
            `INSERT INTO users (username, email, password, role) VALUES (?,?,?,'employee')`,
            [username, email, password],
            (err, res) => {
                if (err) return reject(err);
                resolve(res);
            }
        );
    });
};

module.exports = {
    createUser,
    getUserByUsername,
    createEmployee,
}
