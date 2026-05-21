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

const createProgram = (title,desc,difficulty,createdBy,createdAt) => {
    return new Promise((resolve,reject)=>{
        db.query(`INSERT INTO programs (title, description,difficulty,created_by, created_at) VALUES (?,?,?,?,?)`, [title, desc, difficulty, createdBy, createdAt], (err,res) =>{
            if(err){return reject(err)}
            return resolve(res)
        })
    })
}

const deleteProgram = (id) =>{
    return new Promise((resolve,reject)=>{
        db.query('DELETE FROM programs WHERE id = ?', id, (err,res)=>{
            if(err){return reject(err)}
            resolve(res);
        })
    })
}

const editProgram = (title,description,difficulty,id) => {
    return new Promise ((resolve,reject)=>{
        db.query(`UPDATE programs SET title = ?, description = ?, difficulty = ?,WHERE id = ?`, [title, description, difficulty, id], (err,res)=>{
            if(err){return reject (err)}
            resolve(res);
        });
    })
}

module.exports = {
    getAllPrograms,
    getSingleProgram,
    createProgram,
    deleteProgram,
    editProgram
}