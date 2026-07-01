// Bilioteca de matemática
const math = require('mathjs');

// Repositório com implementação de persistência
const historyRepository = require('../repositories/History');
const userRepository = require('../repositories/User');

const FREE_PLAN_LIMIT = 10;

class Calculate {
    // Executar caso de uso
    async execute(userId, expression) {
        const profile = await userRepository.getProfile(userId);

        if (
            profile &&
            profile.plan === 'free' &&
            profile.usage_count >= FREE_PLAN_LIMIT
        ) {
            throw new Error('LIMIT_REACHED');
        }

        const result = math.evaluate(expression);

        await historyRepository.save(
            userId,
            expression,
            result
        );

        await userRepository.incrementUsage(userId);

        return result;
    }
}

module.exports = new Calculate();