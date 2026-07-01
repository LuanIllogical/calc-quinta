// Casos de uso
const calculate =
    require('../usecases/Calculate');

class CalculatorController {
    // Calcular expressão
    async calculate(req, reply) {
        try {
            const { expression } = req.body;

            const result =
                await calculate.execute(
                    req.user.id,
                    expression
                );

            return { result };
        } catch (err) {
            if (err.message === 'LIMIT_REACHED') {
                return reply
                    .code(403)
                    .send({
                        error: 'Limite do plano gratuito atingido. Faça upgrade para o plano pago.'
                    });
            }

            return reply
                .code(400)
                .send({
                    error: 'Expressão Inválida'
                });
        }
    }
}

module.exports = new CalculatorController();