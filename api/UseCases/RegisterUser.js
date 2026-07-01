// Biblioteca necessária
const bcrypt = require('bcryptjs');

// Repositório com implementação de persistência
const userRepository = require('../repositories/User');

class RegisterUser {
    // Executar caso de uso
    async execute(username, password, institution, education, address) {
        const hash = await bcrypt.hash(password, 10);

        await userRepository.create(
            username,
            hash,
            institution,
            education,
            address
        );

        return {
            message: 'Usuário registrado'
        };
    }
}

module.exports = new RegisterUser();