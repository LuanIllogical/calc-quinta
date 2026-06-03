// Casos de uso
const getHistory =
    require('../usecases/GetHistory');

class HistoryController {
    // Conseguir histórico de operações
    async get(req) {
        return getHistory.execute(req.user.id);
    }
}

module.exports = new HistoryController();