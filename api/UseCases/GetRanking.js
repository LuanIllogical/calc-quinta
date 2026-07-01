// Repositório com implementação de persistência
const historyRepository = require('../repositories/History');

// Símbolos de operação reconhecidos, na ordem em que devem ser checados
const OPERATIONS = [
    { symbol: '+', label: 'Soma (+)' },
    { symbol: '-', label: 'Subtração (-)' },
    { symbol: '*', label: 'Multiplicação (*)' },
    { symbol: '/', label: 'Divisão (/)' },
    { symbol: '^', label: 'Potência (^)' },
    { symbol: 'sqrt', label: 'Raiz Quadrada (√)' },
    { symbol: 'root', label: 'Raiz N-ésima' },
    { symbol: 'log', label: 'Logaritmo' }
];

class GetRanking {
    // Executar caso de uso
    async execute(userId) {
        const history = await historyRepository.findByUser(userId);

        const counts = {};

        for (const entry of history) {
            const expression = entry.expression || '';

            for (const { symbol, label } of OPERATIONS) {
                const matches = expression.split(symbol).length - 1;

                if (matches > 0) {
                    counts[label] = (counts[label] || 0) + matches;
                }
            }
        }

        return Object.entries(counts)
            .map(([operation, total]) => ({ operation, total }))
            .sort((a, b) => b.total - a.total);
    }
}

module.exports = new GetRanking();
