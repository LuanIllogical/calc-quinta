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

const profileUser =
    document.getElementById("profileUser");

const profileInstitution =
    document.getElementById("profileInstitution");

const profileEducation =
    document.getElementById("profileEducation");

const profileAddress =
    document.getElementById("profileAddress");

const profilePlan =
    document.getElementById("profilePlan");

const profileUsage =
    document.getElementById("profileUsage");

const btnUpgrade =
    document.getElementById("btnUpgrade");

const planInfoText =
    document.getElementById("planInfoText");

const rankingdiv =
    document.getElementById("rankingdiv");

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

// Plano atual do usuário (raw: "free" ou "paid")
let currentPlan = "free";
let currentUsage = 0;

function loadProfile() {

    ajax(
        "GET",
        "/profile",
        null,

        res => {

            if (res.error) return;

            profileUser.textContent =
                res.username;

            profileInstitution.textContent =
                res.institution;

            profileEducation.textContent =
                res.education;

            profileAddress.textContent =
                res.address;

            profilePlan.textContent =
                res.plan === "paid" ? "Pago" : "Gratuito";

            currentPlan = res.plan;
            currentUsage = res.usedCalculations;

            if (res.plan === "free") {

                profileUsage.textContent =
                    `${res.usedCalculations}/10`;

                planInfoText.textContent =
                    `Plano Gratuito: ${10 - res.usedCalculations} cálculos restantes.`;

                btnUpgrade.style.display = "inline-block";

            } else {

                profileUsage.textContent =
                    "Ilimitado";

                planInfoText.textContent =
                    "Plano Pago: cálculos ilimitados.";

                btnUpgrade.style.display = "none";
            }
        },

        true
    );
}

// Fazer upgrade para o plano pago
function upgrade() {
    ajax(
        "POST",
        "/upgrade",
        null,

        res => {
            if (res.error) return alert(res.error);

            alert(res.message || "Plano atualizado!");
            loadProfile();
        },

        true
    );
}

function loadRanking() {

    ajax(
        "GET",
        "/ranking",
        null,

        res => {

            if (!Array.isArray(res)) return;

            rankingdiv.innerHTML =
                res.map(item =>

                    `<div>
                        ${item.operation}
                        :
                        ${item.total}
                    </div>`

                ).join("");
        },

        true
    );
}

// Função base do ajax
function ajax(method, url, data, cb, authReq = false) {
    const xhr = new XMLHttpRequest();
    xhr.open(method, API + url, true);

    if (data) {
        xhr.setRequestHeader("Content-Type", "application/json");
    }

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

    ajax("POST","/register",
        {username: user.value,password: pass.value,
        institution:document.getElementById("institution").value,
        education:document.getElementById("education").value,
        address:document.getElementById("address").value},
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

function nthRoot() {
    display.value += "nthRoot(";
}

// Formatar expressão e enviar para a API
function calc() {
    let expression = display.value;
    let originalExpression = expression;

    // Fecha parênteses
    expression = autoCloseParentheses(expression);

    // Substitui √ por sqrt
    expression = expression.replace(/√/g,'sqrt(');
    expression = expression.replace(/sqrt\((\d+)(?!\))/g, 'sqrt($1)');
    expression = expression.replace(/log\((\d+)(?!\))/g, 'log($1)');

    if (currentPlan === "free" && currentUsage >= 10) {

    return alert(
        "Limite do plano gratuito atingido."
        );
    }
    ajax("POST", "/calculate",
        { expression },
        res => {
            if (res.result !== undefined) {
                display.value = res.result;
                historydiv.innerHTML = `<div>${originalExpression} = ${res.result}</div>` + historydiv.innerHTML;
                loadProfile();
                loadRanking();
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
    loadProfile();
    loadHistory();
    loadRanking();
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
document.getElementById("backspace").addEventListener("click", backspace);

document.getElementById("logoutBtn").addEventListener("click", logout);
document.getElementById("nthRoot").addEventListener("click",nthRoot);
btnUpgrade.addEventListener("click", upgrade);
