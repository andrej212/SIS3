const express = require("express");
const blogRoute = express.Router();
const blogService = require("../services/blogService.js");
const authMiddleware = require("../middleware/authMiddleware.js");
const isAdmin = require("../middleware/isAdmin.js");

blogRoute.get("/", async (req, res) => {
    try {
        const results = await blogService.getAllBlogs();
        res.json(results);
    } catch(err) {
        console.log("blog err:", err);
        res.sendStatus(500);
    }
});

blogRoute.get("/:id/comments", async (req, res) => {
    try {
        const comments = await blogService.getComments(req.params.id);
        res.json(comments);
    } catch(err) {
        console.log(err);
        res.sendStatus(500);
    }
});

blogRoute.get("/:id", async (req, res) => {
    try {
        const result = await blogService.getOneBlog(req.params.id);
        res.json(result);
    } catch(err) {
        console.log(err);
        res.sendStatus(500);
    }
});

blogRoute.post("/", authMiddleware, isAdmin, async (req, res) => {
    const { title, content, pdfUrl } = req.body;

    if (!title || !content) {
        return res.status(400).json({ message: "Missing required fields: title, content" });
    }

    try {
        const result = await blogService.createBlog(title, content, pdfUrl, req.user.username);
        res.json(result);
    } catch(err) {
        console.log(err);
        res.sendStatus(500);
    }
});

blogRoute.put("/comments/:commentId/reply", authMiddleware, async (req, res) => {
    const { reply } = req.body;
    if (!reply || !reply.trim()) {
        return res.status(400).json({ message: "Reply cannot be empty" });
    }
    try {
        const result = await blogService.addReply(req.params.commentId, reply.trim());
        res.json(result);
    } catch(err) {
        console.log(err);
        res.sendStatus(500);
    }
});

blogRoute.put("/:id", authMiddleware, isAdmin, async (req, res) => {
    const { title, content, pdfUrl } = req.body;

    if (!title || !content) {
        return res.status(400).json({ message: "Missing required fields" });
    }
    try {
        await blogService.editBlog(title, content, pdfUrl, req.user.username, req.params.id);
        res.status(200).json({ message: "Successfully edited blog" });
    } catch(err) {
        console.log(err);
        res.sendStatus(500);
    }
});

blogRoute.delete("/comments/:commentId", authMiddleware, isAdmin, async (req, res) => {
    try {
        const result = await blogService.deleteComment(req.params.commentId);
        if (result.affectedRows !== 0) {
            return res.status(200).json({ message: "Comment deleted" });
        }
        res.status(400).json({ message: "Comment not found" });
    } catch(err) {
        console.log(err);
        res.sendStatus(500);
    }
});

blogRoute.delete("/:id", authMiddleware, isAdmin, async (req, res) => {
    try {
        const result = await blogService.deleteBlog(req.params.id);
        if (result.affectedRows !== 0) {
            return res.status(200).json({ message: "Blog successfully deleted" });
        }
        res.status(400).json({ message: "Blog not found" });
    } catch(err) {
        console.log(err);
        res.sendStatus(500);
    }
});

blogRoute.post("/:id/comments", authMiddleware, async (req, res) => {
    const { comment } = req.body;
    if (!comment || !comment.trim()) {
        return res.status(400).json({ message: "Comment cannot be empty" });
    }
    try {
        const result = await blogService.addComment(
            req.params.id,
            req.user.id,
            req.user.username,
            comment.trim()
        );
        res.json(result);
    } catch(err) {
        console.log(err);
        res.sendStatus(500);
    }
});

module.exports = blogRoute;
