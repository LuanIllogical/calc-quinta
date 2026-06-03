// Bibliotecas necessárias
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Repositório com implementação de persistência
const userRepository = require('../repositories/User');

class LoginUser {
    // Executar caso de uso
    async execute(username, password) {
        const user = await userRepository.findByUsername(username);

        if (!user) {
            throw new Error('INVALID_CREDENTIALS');
        }

        const ok = await bcrypt.compare(password, user.password);

        if (!ok) {
            throw new Error('INVALID_CREDENTIALS');
        }

        return jwt.sign(
            {
                id: user.id,
                username: user.username
            },
            process.env.JWT_SECRET
        );
    }
}

module.exports = new LoginUser();