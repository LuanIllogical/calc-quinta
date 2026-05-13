const pool = require('./connection');

async function createUser(username, passwordHash) {
    return pool.query(
        `INSERT INTO users (username, password)
     VALUES ($1, $2)`,
        [username, passwordHash]
    );
}

async function getUserByUsername(username) {
    const res = await pool.query(
        `SELECT * FROM users WHERE username = $1`,
        [username]
    );

    return res.rows[0];
}

async function insertHistory(userId, expression, result) {
    return pool.query(
        `INSERT INTO history (user_id, expression, result)
     VALUES ($1, $2, $3)`,
        [userId, expression, result]
    );
}

async function getHistoryByUser(userId) {
    const res = await pool.query(
        `SELECT expression, result, created_at
     FROM history
     WHERE user_id = $1
     ORDER BY created_at DESC`,
        [userId]
    );

    return res.rows;
}

module.exports = {
    createUser,
    getUserByUsername,
    insertHistory,
    getHistoryByUser
};