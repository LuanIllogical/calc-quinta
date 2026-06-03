// Casos de uso
const registerUser = require('../usecases/RegisterUser');
const loginUser = require('../usecases/LoginUser');

class AuthController {
    // Registrar usuário
    async register(req, reply) {
        try {
            const { username, password } = req.body;

            return await registerUser.execute(
                username,
                password
            );
        } catch {
            return reply
                .code(400)
                .send({
                    error: 'Um Usuário com este nome já existe'
                });
        }
    }
    // Fazer login
    async login(req, reply) {
        try {
            const { username, password } = req.body;

            const token = await loginUser.execute(
                username,
                password
            );

            return { token };
        } catch {
            return reply
                .code(400)
                .send({
                    error: 'Credenciais Inválidas'
                });
        }
    }
}

module.exports = new AuthController();