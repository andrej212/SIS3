const db = require("../db/connection.js");

const getAllBlogs = () => {
    return new Promise((resolve, reject) => {
        db.query("SELECT * FROM blog_posts", (err, res) => {
            if(err){return reject(err); }
            resolve(res);
        });
    });
};

const getOneBlog = (id) => {
    return new Promise((resolve,reject)=>{
        db.query(`SELECT * FROM blog_posts WHERE id = ?`, id, (err, res)=>{
            if(err){return reject(err);}
            resolve(res);
        })
    })
}

const createBlog = (title, pdfUrl, createdBy) =>{
    return new Promise((resolve,reject)=>{
        db.query(`INSERT INTO blog_posts (title,pdf_url,created_by) VALUES (?,?,?)`,[title , pdfUrl, createdBy], (err,res)=>{
            if(err){return reject(err)}
            resolve(res);
        });
    });
}

const deleteBlog = (id) => {
    return new Promise((resolve,reject)=>{
        db.query('DELETE FROM blog_posts WHERE id=?',id, (err,res)=>{
            if(err){return reject(err)}
            resolve(res);
        });
    })
}

const editBlog = (title,pdfUrl,createdBy,id) => {
    return new Promise((resolve,reject)=>{
        db.query(`UPDATE blog_posts SET title=?, pdf_url=?, created_by=? WHERE id = ?`,[title,pdfUrl,createdBy,id],(err,res)=>{
            if(err){return reject(err)}
            resolve(res);
        })
    })
}

module.exports = {
    getAllBlogs,
    getOneBlog,
    createBlog,
    deleteBlog,
    editBlog
};