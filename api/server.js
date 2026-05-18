// Variáveis secretas de conexão com o banco
require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET;

// Bibliotecas necessárias
const fastify = require('fastify')({ logger: true });
const cors = require('@fastify/cors');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const math = require('mathjs');

const db = require('./database');

// Definição do cors
fastify.register(cors, { origin: true });

// Autenticação
async function auth(request, reply) {
    try {
        const authHeader = request.headers.authorization;

        if (!authHeader) {
            return reply.code(401).send({ error: 'Missing token' });
        }

        const token = authHeader.split(' ')[1];
        request.user = jwt.verify(token, JWT_SECRET);

    } catch {
        return reply.code(401).send({ error: 'Invalid token' });
    }
}

// Rota para registrar usuário
fastify.post('/register', async (req, reply) => {
    const { username, password } = req.body;

    try {
        const hash = await bcrypt.hash(password, 10);

        await db.createUser(username, hash);

        return { message: 'Usuário registrado' };
    } catch {
        return reply.code(400).send({ error: 'Um Usuário com este nome já existe' });
    }
});

// Rota para fazer login
fastify.post('/login', async (req, reply) => {
    const { username, password } = req.body;

    const user = await db.getUserByUsername(username);

    if (!user) {
        return reply.code(400).send({ error: 'Credenciais Inválidas' });
    }

    const ok = await bcrypt.compare(password, user.password);

    if (!ok) {
        return reply.code(400).send({ error: 'Credenciais Inválidas' });
    }

    const token = jwt.sign(
        { id: user.id, username: user.username },
        JWT_SECRET
    );

    return { token };
});

// Rota para calcular expressão
fastify.post('/calculate', { preHandler: auth }, async (req, reply) => {
    const { expression } = req.body;

    try {
        const result = math.evaluate(expression);

        await db.insertHistory(req.user.id, expression, result);

        return { result };
    } catch {
        return reply.code(400).send({ error: 'Expressão Inválida' });
    }
});

// Rota para puxar histórico do usuário
fastify.get('/history', { preHandler: auth }, async (req) => {
    return db.getHistoryByUser(req.user.id);
});

// Console do servidor
fastify.listen({ port: process.env.PORT }, (err) => {
    if (err) throw err;
    console.log('Servidor rodando');
});