// Banco de dados
const db = require('../Database/Index');

class UserRepository {
    // Criar usuário
    async create(username, passwordHash) {
        return db.createUser(username, passwordHash);
    }
    // Achar usuário pelo nome
    async findByUsername(username) {
        return db.getUserByUsername(username);
    }
}

module.exports = new UserRepository();