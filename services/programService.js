const db = require("../db/connection.js");

const getAllPrograms = () => {
    return new Promise ((resolve,reject)=>{
        db.query(`SELECT * FROM programs`,(err,result)=>{
            if(err){
                return reject(err);
            }
            resolve(result);
        });
    });
};

const getSingleProgram = (id) => {
    return new Promise((resolve,reject)=>{
        db.query(`SELECT * FROM programs WHERE id = ?`, id, (err,result)=>{
            if(err){
                return reject(err);
            }
            resolve(result);
        });
    })
}

module.exports = {
    getAllPrograms,
    getSingleProgram
}