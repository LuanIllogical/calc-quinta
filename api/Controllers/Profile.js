// Casos de uso
const getProfile = require('../usecases/GetProfile');
const upgradePlan = require('../usecases/UpgradePlan');

class ProfileController {
    // Conseguir dados do usuário logado
    async get(req, reply) {
        try {
            return await getProfile.execute(req.user.id);
        } catch {
            return reply
                .code(400)
                .send({
                    error: 'Não foi possível carregar o perfil'
                });
        }
    }

    // Atualizar plano do usuário para pago
    async upgrade(req, reply) {
        try {
            return await upgradePlan.execute(req.user.id);
        } catch {
            return reply
                .code(400)
                .send({
                    error: 'Não foi possível atualizar o plano'
                });
        }
    }
}

module.exports = new ProfileController();
