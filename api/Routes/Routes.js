// Controladores
const authController =
    require('../controllers/Auth');

const calculatorController =
    require('../controllers/Calculator');

const historyController =
    require('../controllers/History');

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