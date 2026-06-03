// Banco de dados
const db = require('../Database/Index');

class HistoryRepository {
    // Salvar expressão = resultado
    async save(userId, expression, result) {
        return db.insertHistory(userId, expression, result);
    }
    // Achar histórico com base no usuário
    async findByUser(userId) {
        return db.getHistoryByUser(userId);
    }
}

module.exports = new HistoryRepository();