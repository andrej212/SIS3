const express = require("express");
const memberRouter = express.Router();
const memberService = require("../services/memberService.js");
const authMiddleware = require("../middleware/authMiddleware.js");
const isAdminOrEmployee = require("../middleware/isAdminOrEmployee.js");

memberRouter.get("/", authMiddleware, async (req, res) => {
    try {
        const members = await memberService.getAllMembers();
        res.json(members);
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});

memberRouter.post("/", authMiddleware, isAdminOrEmployee, async (req, res) => {
    const { name, surname, startDate } = req.body;
    if (!name || !surname || !startDate) {
        return res.status(400).json({ message: "Missing fields: name, surname, startDate" });
    }
    try {
        const result = await memberService.createMember(name, surname, startDate);
        res.status(201).json({ message: "Member created", id: result.insertId });
    } catch (err) {
        if (err.code === "ER_DUP_ENTRY") {
            return res.status(409).json({ message: "A member with that name and surname already exists." });
        }
        console.log(err);
        res.sendStatus(500);
    }
});

memberRouter.put("/:id", authMiddleware, isAdminOrEmployee, async (req, res) => {
    const { startDate } = req.body;
    if (!startDate) {
        return res.status(400).json({ message: "Missing field: startDate" });
    }
    try {
        const result = await memberService.updateMemberStartDate(req.params.id, startDate);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Member not found" });
        }
        res.json({ message: "Member updated" });
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});

memberRouter.delete("/:id", authMiddleware, isAdminOrEmployee, async (req, res) => {
    try {
        const result = await memberService.deleteMember(req.params.id);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Member not found" });
        }
        res.json({ message: "Member deleted" });
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});

module.exports = memberRouter;
