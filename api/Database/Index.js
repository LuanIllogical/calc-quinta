// Dados para conexão com o banco
const pool = require('./Connection');

// Registrar usuário
async function createUser(username, passwordHash, institution, education, address) {
    return pool.query(
        `INSERT INTO users 
        (username, password, institution, education, address, plan, usage_count)
        VALUES ($1, $2, $3, $4, $5, 'free', 0)`,
        [username, passwordHash, institution, education, address]
    );
}

// Achar usuário pelo nome
async function getUserByUsername(username) {
    const res = await pool.query(
        `SELECT * FROM users WHERE username = $1`,
        [username]
    );

    return res.rows[0];
}

// Adicionar operação no histórico
async function insertHistory(userId, expression, result) {
    return pool.query(
        `INSERT INTO history (user_id, expression, result)
         VALUES ($1, $2, $3)`,
        [userId, expression, result]
    );
}

// Achar histórico pelo usuário
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

async function incrementUserUsage(userId) {
    return pool.query(
        `UPDATE users
         SET usage_count = usage_count + 1
         WHERE id = $1`,
        [userId]
    );
}

async function updateUserPlan(userId, plan) {
    return pool.query(
        `UPDATE users
         SET plan = $1
         WHERE id = $2`,
        [plan, userId]
    );
}

async function getUserProfile(userId) {
    const res = await pool.query(
        `SELECT 
            username,
            institution,
            education,
            address,
            plan,
            usage_count
         FROM users
         WHERE id = $1`,
        [userId]
    );

    return res.rows[0];
}

module.exports = {
    createUser,
    getUserByUsername,
    insertHistory,
    getHistoryByUser,
    incrementUserUsage,
    updateUserPlan,
    getUserProfile
};