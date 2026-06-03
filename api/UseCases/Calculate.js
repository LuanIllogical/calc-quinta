// Bilioteca de matemática
const math = require('mathjs');

// Repositório com implementação de persistência
const historyRepository = require('../repositories/History');

class Calculate {
    // Executar caso de uso
    async execute(userId, expression) {
        const result = math.evaluate(expression);

        await historyRepository.save(
            userId,
            expression,
            result
        );

        return result;
    }
}

module.exports = new Calculate();