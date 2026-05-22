const db = require ("../db/connection");

const getAllSubscriptions = () => {
    return new Promise((resolve,reject)=>{
        db.query('SELECT * FROM subscriptions', (err,res)=>{
            if(err){return reject(err)}
            resolve(res);
        })
    })
}

const getSingleSubscription = (id) =>{
    return new Promise((resolve,reject)=>{
        db.query(`SELECT * FROM subscriptions WHERE id=?`, id, (err,res) =>{
            if(err){return reject(err)}
            resolve(res);
        });
    })
}

const createSubscription = (user_id,full_name, start_date) =>{
    return new Promise((resolve,reject)=>{
        db.query(`INSERT INTO subscriptions (user_id,full_name,start_date) VALUES (?,?,?)`,[user_id,full_name,start_date], (err,res)=>{
            if(err){return reject(err)}
            resolve(res);
        });
    })
}

const deleteSubscription = (id) => {
    return new Promise((resolve,reject)=>{
        db.query(`DELETE FROM subscriptions WHERE id = ?`,id, (err,res)=>{
            if(err){return reject(err)}
            resolve(res);
        });
    })
}

const editSubscription = (user_id, full_name, start_date, id) => {
     return new Promise((resolve,reject)=>{
        db.query(`UPDATE subscriptions SET user_id =?, full_name = ?, start_date = ? WHERE id= ?`,[user_id,full_name,start_date,id], (err,res)=>{
            if(err){return reject(err)}
            resolve(res);
        });
    })
}

module.exports = {
    getAllSubscriptions,
    getSingleSubscription,
    createSubscription,
    deleteSubscription,
    editSubscription
}