// Link da API
const API = "http://localhost:3000";

// Se o token de login estiver guardado, adquire ele
let token = localStorage.getItem("token");

// Tela de autenticação
const auth = document.getElementById("auth");

// Tela da calculadora
const app = document.getElementById("app");


// Área de display da calculadora
const display = document.getElementById("display");

// Área do histórico de operações
const historydiv = document.getElementById("historydiv");

// Caso o token de login existir, pular a tela de autenticação
if (token) showApp();

// Adicionar ao display da calculadora
function add(v) {
    display.value += v;
}

// Limpar o display da calculadora
function clearD() {
    display.value = "";
}

// Deletar último caractere do display da calculadora
function backspace() {
    display.value = display.value.slice(0, -1);
}

// Função base do ajax
function ajax(method, url, data, cb, authReq = false) {
    const xhr = new XMLHttpRequest();
    xhr.open(method, API + url, true);

    xhr.setRequestHeader("Content-Type", "application/json");

    if (authReq && token) {
        xhr.setRequestHeader("Authorization", "Bearer " + token);
    }

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            try {
                cb(JSON.parse(xhr.responseText));
            } catch {
                cb({ error: "API offline ou resposta inválida" });
            }
        }
    };

    xhr.send(data ? JSON.stringify(data) : null);
}

// Registrar usuário
function register() {
    if (!user.value || !pass.value) return alert("Preencha todos os campos");

    ajax("POST", "/register",
        { username: user.value, password: pass.value },
        res => alert(res.message || res.error)
    );
}

// Fazer login
function login() {
    if (!user.value || !pass.value) return alert("Preencha todos os campos");

    ajax("POST", "/login",
        { username: user.value, password: pass.value },
        res => {
            if (res.token) {
                token = res.token;
                localStorage.setItem("token", token);
                showApp();
            } else {
                alert(res.error);
            }
        }
    );
}

// Sair
function logout() {
    localStorage.removeItem("token");
    location.reload();
}

// Formatar expressão e enviar para a API
function calc() {
    let expression = display.value;
    let originalExpression = expression;

    // Fecha parênteses
    expression = autoCloseParentheses(expression);

    // Substitui √ por sqrt
    expression = expression.replace(/√/g, 'sqrt(');
    expression = expression.replace(/sqrt\((\d+)(?!\))/g, 'sqrt($1)');
    expression = expression.replace(/log\((\d+)(?!\))/g, 'log($1)');

    ajax("POST", "/calculate",
        { expression },
        res => {
            if (res.result !== undefined) {
                display.value = res.result;
                historydiv.innerHTML = `<div>${originalExpression} = ${res.result}</div>` + historydiv.innerHTML;
            } else {
                alert(res.error);
            }
        },
        true
    );
}

// Botão de raiz quadrada
function sqrt() {
    display.value += "√";
}

// Botão de log
function log() {
    display.value += "log(";
}

// Função para fechar parênteses automaticamente
function autoCloseParentheses(expr) {
    let open = 0;

    for (let char of expr) {
        if (char === "(") open++;
        if (char === ")") open--;
    }

    return expr + ")".repeat(open);
}

// Esconder tela de autenticação e mostrar tela da calculadora
function showApp() {
    auth.style.display = "none";
    app.style.display = "block";
    loadHistory();
}

// Carregar histórico de operações
function loadHistory() {
    ajax("GET", "/history", null, res => {
        historydiv.innerHTML = res
            .map(h => `<div>${h.expression} = ${h.result}</div>`)
            .join("");
    }, true);
}

// EventListeners

// Botões sobre autenticação
document.getElementById("btnRegister").addEventListener("click", register);
document.getElementById("btnLogin").addEventListener("click", login);

// Números e operadores simples da calculadora
document.querySelectorAll("[data-value]").forEach(btn => {
    btn.addEventListener("click", () => add(btn.dataset.value));
});

// Botões mais complexos da calculadora
document.getElementById("clear").addEventListener("click", clearD);
document.getElementById("calcBtn").addEventListener("click", calc);

document.getElementById("sqrt").addEventListener("click", sqrt);
document.getElementById("log").addEventListener("click", log);
document.getElementById("backspace").addEventListener("click", backspace);

document.getElementById("logoutBtn").addEventListener("click", logout);

