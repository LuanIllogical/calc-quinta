// Casos de uso
const getRanking = require('../usecases/GetRanking');

class RankingController {
    // Conseguir ranking de operações do usuário logado
    async get(req) {
        return getRanking.execute(req.user.id);
    }
}

module.exports = new RankingController();
