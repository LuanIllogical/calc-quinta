// Bibliotecas necesárias
const fastify =
    require('fastify')({ logger: true });
const cors =
    require('@fastify/cors');

// Variáveis de ambiente
require('dotenv').config();

// Conexão com banco
const pool = require('./Database/connection');
// Teste da conexão
pool.query('SELECT NOW()')
    .then(res => {
        console.log('Banco conectado!');
        console.log(res.rows[0]);
    })
    .catch(err => {
        console.log('Erro no banco:');
        console.log(err);
    });

// Definição de rotas
const routes =
    require('./routes/routes');

// Registro do cors no fastify
fastify.register(cors, {
    origin: true
});

// Registro das rotas no fastify
fastify.register(routes);

// Listen do fastify no port definido nas variáveis de ambiente
fastify.listen({
    port: process.env.PORT
});