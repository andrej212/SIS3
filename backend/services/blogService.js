const db = require("../db/connection.js");

const getAllBlogs = () => {
    return new Promise((resolve, reject) => {
        db.query("SELECT * FROM blog_posts ORDER BY id DESC", (err, res) => {
            if(err){return reject(err);}
            resolve(res);
        });
    });
};

const getOneBlog = (id) => {
    return new Promise((resolve, reject) => {
        db.query("SELECT * FROM blog_posts WHERE id = ?", [id], (err, res) => {
            if(err){return reject(err);}
            resolve(res);
        });
    });
};

const createBlog = (title, content, pdfUrl, createdBy) => {
    return new Promise((resolve, reject) => {
        db.query(
            "INSERT INTO blog_posts (title, content, pdf_url, created_by) VALUES (?,?,?,?)",
            [title, content, pdfUrl || null, createdBy],
            (err, res) => {
                if(err){return reject(err);}
                resolve(res);
            }
        );
    });
};

const deleteBlog = (id) => {
    return new Promise((resolve, reject) => {
        db.query("DELETE FROM blog_posts WHERE id = ?", [id], (err, res) => {
            if(err){return reject(err);}
            resolve(res);
        });
    });
};

const editBlog = (title, content, pdfUrl, createdBy, id) => {
    return new Promise((resolve, reject) => {
        db.query(
            "UPDATE blog_posts SET title=?, content=?, pdf_url=?, created_by=? WHERE id = ?",
            [title, content, pdfUrl || null, createdBy, id],
            (err, res) => {
                if(err){return reject(err);}
                resolve(res);
            }
        );
    });
};

const getComments = (blogId) => {
    return new Promise((resolve, reject) => {
        db.query(
            "SELECT * FROM blog_comments WHERE blog_id = ? ORDER BY created_at ASC",
            [blogId],
            (err, res) => {
                if(err){return reject(err);}
                resolve(res);
            }
        );
    });
};

const addComment = (blogId, userId, username, comment) => {
    return new Promise((resolve, reject) => {
        db.query(
            "INSERT INTO blog_comments (blog_id, user_id, username, comment) VALUES (?,?,?,?)",
            [blogId, userId, username, comment],
            (err, res) => {
                if(err){return reject(err);}
                resolve(res);
            }
        );
    });
};

const addReply = (commentId, reply) => {
    return new Promise((resolve, reject) => {
        db.query(
            "UPDATE blog_comments SET reply = ? WHERE id = ?",
            [reply, commentId],
            (err, res) => {
                if(err){return reject(err);}
                resolve(res);
            }
        );
    });
};

const deleteComment = (commentId) => {
    return new Promise((resolve, reject) => {
        db.query(
            "DELETE FROM blog_comments WHERE id = ?",
            [commentId],
            (err, res) => {
                if(err){return reject(err);}
                resolve(res);
            }
        );
    });
};

module.exports = {
    getAllBlogs,
    getOneBlog,
    createBlog,
    deleteBlog,
    editBlog,
    getComments,
    addComment,
    addReply,
    deleteComment,
};
