const db = require("../db/connection.js");

const getAllBlogs = () => {
    return new Promise((resolve, reject) => {
        db.query("SELECT * FROM blog_posts", (err, res) => {
            if (err) {
                return reject(err);
            }
            resolve(res);
        });
    });
};

const getOneBlog = (id) => {
    return new Promise((resolve,reject)=>{
        db.query(`SELECT * FROM blog_posts WHERE id = ?`, id, (err, res)=>{
            if(err){
                return reject(err);
            }
            resolve(res);
        })
    })
}

module.exports = {
    getAllBlogs,
    getOneBlog
};