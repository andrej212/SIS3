const db = require("../db/connection.js");

const getAllMembers = () => {
    return new Promise((resolve, reject) => {
        db.query(`SELECT * FROM members ORDER BY end_date ASC`, (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};

const createMember = (name, surname, startDate) => {
    return new Promise((resolve, reject) => {
        db.query(
            `INSERT INTO members (name, surname, start_date, end_date)
             VALUES (?, ?, ?, DATE_ADD(?, INTERVAL 1 MONTH))`,
            [name, surname, startDate, startDate],
            (err, result) => {
                if (err) return reject(err);
                resolve(result);
            }
        );
    });
};

const updateMemberStartDate = (id, startDate) => {
    return new Promise((resolve, reject) => {
        db.query(
            `UPDATE members SET start_date = ?, end_date = DATE_ADD(?, INTERVAL 1 MONTH) WHERE id = ?`,
            [startDate, startDate, id],
            (err, result) => {
                if (err) return reject(err);
                resolve(result);
            }
        );
    });
};

const deleteMember = (id) => {
    return new Promise((resolve, reject) => {
        db.query(`DELETE FROM members WHERE id = ?`, [id], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};

module.exports = { getAllMembers, createMember, updateMemberStartDate, deleteMember };
