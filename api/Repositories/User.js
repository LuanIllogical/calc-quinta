// Banco de dados
const db = require('../Database/Index');

class UserRepository {
    // Criar usuário
    async create(username, passwordHash, institution, education, address) {
        return db.createUser(username, passwordHash, institution, education, address);
    }
    // Achar usuário pelo nome
    async findByUsername(username) {
        return db.getUserByUsername(username);
    }
    // Achar perfil do usuário pelo id
    async getProfile(userId) {
        return db.getUserProfile(userId);
    }
    // Atualizar plano do usuário
    async updatePlan(userId, plan) {
        return db.updateUserPlan(userId, plan);
    }
    // Incrementar contagem de uso do usuário
    async incrementUsage(userId) {
        return db.incrementUserUsage(userId);
    }
}

module.exports = new UserRepository();