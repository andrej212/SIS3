const db = require("../db/connection.js");

const getAllPrograms = () => {
    return new Promise ((resolve,reject)=>{
        db.query(
            `SELECT p.*, ROUND(AVG(pr.rating), 1) as avg_rating, COUNT(pr.id) as rating_count
             FROM programs p
             LEFT JOIN program_ratings pr ON pr.program_id = p.id
             GROUP BY p.id`,
            (err,result)=>{
                if(err){ return reject(err); }
                resolve(result);
            }
        );
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
        db.query(`UPDATE programs SET title = ?, description = ?, difficulty = ? WHERE id = ?`, [title, description, difficulty, id], (err,res)=>{
            if(err){return reject (err)}
            resolve(res);
        });
    })
}

const rateProgram = (programId, userId, rating) => {
    return new Promise((resolve, reject) => {
        db.query(
            `INSERT INTO program_ratings (program_id, user_id, rating)
             VALUES (?, ?, ?)
             ON DUPLICATE KEY UPDATE rating = VALUES(rating)`,
            [programId, userId, rating],
            (err, res) => {
                if (err) return reject(err);
                resolve(res);
            }
        );
    });
};

const getUserRatings = (userId) => {
    return new Promise((resolve, reject) => {
        db.query(
            `SELECT program_id, rating FROM program_ratings WHERE user_id = ?`,
            [userId],
            (err, res) => {
                if (err) return reject(err);
                resolve(res);
            }
        );
    });
};

module.exports = {
    getAllPrograms,
    getSingleProgram,
    createProgram,
    deleteProgram,
    editProgram,
    rateProgram,
    getUserRatings,
}