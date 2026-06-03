// Autenticação
const jwt = require('jsonwebtoken');

async function auth(req, reply) {
    try {
        const authHeader =
            req.headers.authorization;

        if (!authHeader) {
            return reply
                .code(401)
                .send({ error: 'Missing token' });
        }

        const token =
            authHeader.split(' ')[1];

        req.user = jwt.verify(
            token,
            process.env.JWT_SECRET
        );
    } catch {
        return reply
            .code(401)
            .send({ error: 'Invalid token' });
    }
}

module.exports = auth;