// Repositório com implementação de persistência
const userRepository = require('../repositories/User');

class GetProfile {
    // Executar caso de uso
    async execute(userId) {
        const profile = await userRepository.getProfile(userId);

        if (!profile) {
            throw new Error('USER_NOT_FOUND');
        }

        return {
            username: profile.username,
            institution: profile.institution,
            education: profile.education,
            address: profile.address,
            plan: profile.plan,
            usedCalculations: profile.usage_count
        };
    }
}

module.exports = new GetProfile();
