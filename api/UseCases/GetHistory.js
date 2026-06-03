// Repositório com implementação de persistência
const historyRepository = require('../repositories/History');

class GetHistory {
    // Executar caso de uso
    async execute(userId) {
        return historyRepository.findByUser(userId);
    }
}

module.exports = new GetHistory();