// Controladores
const authController =
    require('../controllers/Auth');

const calculatorController =
    require('../controllers/Calculator');

const historyController =
    require('../controllers/History');

const profileController =
    require('../controllers/Profile');

const rankingController =
    require('../controllers/Ranking');

const auth =
    require('../middleware/auth');

async function routes(fastify) {
    // Auth
    // Registrar usuário
    fastify.post(
        '/register',
        authController.register
    );
    // Fazer login
    fastify.post(
        '/login',
        authController.login
    );

    // Profile
    // Conseguir dados do usuário logado
    fastify.get(
        '/profile',
        { preHandler: auth },
        profileController.get
    );
    // Fazer upgrade para o plano pago
    fastify.post(
        '/upgrade',
        { preHandler: auth },
        profileController.upgrade
    );

    // Ranking
    // Conseguir ranking de operações
    fastify.get(
        '/ranking',
        { preHandler: auth },
        rankingController.get
    );

    // Calculator
    // Calcular expressão
    fastify.post(
        '/calculate',
        { preHandler: auth },
        calculatorController.calculate
    );

    // History
    // Conseguir histórico
    fastify.get(
        '/history',
        { preHandler: auth },
        historyController.get
    );
}

module.exports = routes;