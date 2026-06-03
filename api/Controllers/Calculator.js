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
        } catch {
            return reply
                .code(400)
                .send({
                    error: 'Expressão Inválida'
                });
        }
    }
}

module.exports = new CalculatorController();