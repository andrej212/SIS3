const db = require("../db/connection.js");

const getAllThreads = () => {
    return new Promise((resolve, reject) => {
        db.query(
            `SELECT t.*, COUNT(p.id) AS post_count
             FROM forum_threads t
             LEFT JOIN forum_posts p ON p.thread_id = t.id
             GROUP BY t.id
             ORDER BY t.created_at DESC`,
            (err, res) => {
                if (err) return reject(err);
                resolve(res);
            }
        );
    });
};

const getThread = (id) => {
    return new Promise((resolve, reject) => {
        db.query("SELECT * FROM forum_threads WHERE id = ?", [id], (err, res) => {
            if (err) return reject(err);
            resolve(res);
        });
    });
};

const getThreadPosts = (threadId) => {
    return new Promise((resolve, reject) => {
        db.query(
            "SELECT * FROM forum_posts WHERE thread_id = ? ORDER BY created_at ASC",
            [threadId],
            (err, res) => {
                if (err) return reject(err);
                resolve(res);
            }
        );
    });
};

const createThread = (title, content, userId, username) => {
    return new Promise((resolve, reject) => {
        db.query(
            "INSERT INTO forum_threads (title, content, user_id, username) VALUES (?,?,?,?)",
            [title, content, userId, username],
            (err, res) => {
                if (err) return reject(err);
                resolve(res);
            }
        );
    });
};

const editThread = (title, content, id) => {
    return new Promise((resolve, reject) => {
        db.query(
            "UPDATE forum_threads SET title=?, content=? WHERE id=?",
            [title, content, id],
            (err, res) => {
                if (err) return reject(err);
                resolve(res);
            }
        );
    });
};

const deleteThread = (id) => {
    return new Promise((resolve, reject) => {
        db.query("DELETE FROM forum_threads WHERE id=?", [id], (err, res) => {
            if (err) return reject(err);
            resolve(res);
        });
    });
};

const createPost = (threadId, userId, username, content) => {
    return new Promise((resolve, reject) => {
        db.query(
            "INSERT INTO forum_posts (thread_id, user_id, username, content) VALUES (?,?,?,?)",
            [threadId, userId, username, content],
            (err, res) => {
                if (err) return reject(err);
                resolve(res);
            }
        );
    });
};

const editPost = (content, id) => {
    return new Promise((resolve, reject) => {
        db.query(
            "UPDATE forum_posts SET content=? WHERE id=?",
            [content, id],
            (err, res) => {
                if (err) return reject(err);
                resolve(res);
            }
        );
    });
};

const deletePost = (id) => {
    return new Promise((resolve, reject) => {
        db.query("DELETE FROM forum_posts WHERE id=?", [id], (err, res) => {
            if (err) return reject(err);
            resolve(res);
        });
    });
};

const getPostById = (id) => {
    return new Promise((resolve, reject) => {
        db.query("SELECT * FROM forum_posts WHERE id=?", [id], (err, res) => {
            if (err) return reject(err);
            resolve(res);
        });
    });
};

module.exports = {
    getAllThreads,
    getThread,
    getThreadPosts,
    createThread,
    editThread,
    deleteThread,
    createPost,
    editPost,
    deletePost,
    getPostById,
};
