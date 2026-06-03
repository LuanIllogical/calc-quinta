// Bibliotecas necesárias
const fastify =
    require('fastify')({ logger: true });
const cors =
    require('@fastify/cors');

// Variáveis de ambiente
require('dotenv').config();

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