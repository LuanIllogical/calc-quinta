// Repositório com implementação de persistência
const userRepository = require('../repositories/User');

class UpgradePlan {
    // Executar caso de uso
    async execute(userId) {
        await userRepository.updatePlan(userId, 'paid');

        return {
            message: 'Plano atualizado para Pago'
        };
    }
}

module.exports = new UpgradePlan();
