const express = require("express");
const forumRoute = express.Router();
const forumService = require("../services/forumService.js");
const authMiddleware = require("../middleware/authMiddleware.js");

// GET all threads
forumRoute.get("/", async (req, res) => {
    try {
        const threads = await forumService.getAllThreads();
        res.json(threads);
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});

// GET single thread + its posts
forumRoute.get("/:id", async (req, res) => {
    try {
        const thread = await forumService.getThread(req.params.id);
        if (thread.length === 0) return res.status(404).json({ message: "Thread not found" });
        const posts = await forumService.getThreadPosts(req.params.id);
        res.json({ thread: thread[0], posts });
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});

// POST create thread
forumRoute.post("/", authMiddleware, async (req, res) => {
    const { title, content } = req.body;
    if (!title || !content) return res.status(400).json({ message: "Missing title or content" });
    try {
        const result = await forumService.createThread(title, content, req.user.id, req.user.username);
        res.status(201).json({ message: "Thread created", id: result.insertId });
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});

// PUT edit thread (own or admin)
forumRoute.put("/:id", authMiddleware, async (req, res) => {
    const { title, content } = req.body;
    if (!title || !content) return res.status(400).json({ message: "Missing title or content" });
    try {
        const rows = await forumService.getThread(req.params.id);
        if (rows.length === 0) return res.status(404).json({ message: "Thread not found" });
        const thread = rows[0];
        if (thread.user_id !== req.user.id && req.user.role !== "admin") {
            return res.status(403).json({ message: "Not allowed" });
        }
        await forumService.editThread(title, content, req.params.id);
        res.json({ message: "Thread updated" });
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});

// DELETE thread (own or admin)
forumRoute.delete("/:id", authMiddleware, async (req, res) => {
    try {
        const rows = await forumService.getThread(req.params.id);
        if (rows.length === 0) return res.status(404).json({ message: "Thread not found" });
        const thread = rows[0];
        if (thread.user_id !== req.user.id && req.user.role !== "admin") {
            return res.status(403).json({ message: "Not allowed" });
        }
        await forumService.deleteThread(req.params.id);
        res.json({ message: "Thread deleted" });
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});

// POST reply to thread
forumRoute.post("/:id/posts", authMiddleware, async (req, res) => {
    const { content } = req.body;
    if (!content || !content.trim()) return res.status(400).json({ message: "Content cannot be empty" });
    try {
        const thread = await forumService.getThread(req.params.id);
        if (thread.length === 0) return res.status(404).json({ message: "Thread not found" });
        const result = await forumService.createPost(req.params.id, req.user.id, req.user.username, content.trim());
        res.status(201).json({ message: "Post created", id: result.insertId });
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});

// PUT edit post (own or admin)
forumRoute.put("/posts/:postId", authMiddleware, async (req, res) => {
    const { content } = req.body;
    if (!content || !content.trim()) return res.status(400).json({ message: "Content cannot be empty" });
    try {
        const rows = await forumService.getPostById(req.params.postId);
        if (rows.length === 0) return res.status(404).json({ message: "Post not found" });
        const post = rows[0];
        if (post.user_id !== req.user.id && req.user.role !== "admin") {
            return res.status(403).json({ message: "Not allowed" });
        }
        await forumService.editPost(content.trim(), req.params.postId);
        res.json({ message: "Post updated" });
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});

// DELETE post (own or admin)
forumRoute.delete("/posts/:postId", authMiddleware, async (req, res) => {
    try {
        const rows = await forumService.getPostById(req.params.postId);
        if (rows.length === 0) return res.status(404).json({ message: "Post not found" });
        const post = rows[0];
        if (post.user_id !== req.user.id && req.user.role !== "admin") {
            return res.status(403).json({ message: "Not allowed" });
        }
        await forumService.deletePost(req.params.postId);
        res.json({ message: "Post deleted" });
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});

module.exports = forumRoute;
