// Link da API, se fosse um link mesmo de produção deveria estar em um .env em vez de no aberto assim
const API = "http://localhost:3000";

// Token de autenticação
let token = localStorage.getItem("token");

// Caso token já exista (login previamente feito), pular tela de login
if (token) showApp();

// Adicionar para resultado
function add(v) {
    document.getElementById("display").value += v;
}

// Limpar resultado
function clearD() {
    document.getElementById("display").value = "";
}

// Ajax geral utilizando do link da API e token de autorização
function ajax(method, url, data, cb, auth = false) {
    const xhr = new XMLHttpRequest();
    xhr.open(method, API + url, true);

    xhr.setRequestHeader("Content-Type", "application/json");

    if (auth && token) {
        xhr.setRequestHeader("Authorization", "Bearer " + token);
    }

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            cb(JSON.parse(xhr.responseText));
        }
    };

    xhr.send(data ? JSON.stringify(data) : null);
}

// Registrar usuário novo
function register() {
    if (!user.value || !pass.value) {
        alert("Preencha todos os campos")
        return;
    }
    ajax("POST", "/register",
        { username: user.value, password: pass.value },
        res => alert(res.message || res.error)
    );
}

// Logar com usuário existente
function login() {
    if (!user.value || !pass.value) {
        alert("Preencha todos os campos")
        return;
    }
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

// Sair removendo o token e recarregando a página
function logout() {
    localStorage.removeItem("token");
    location.reload();
}

// Escondando a parte de login e mostrando a calculadora, além de carregar o histórico
function showApp() {
    auth.style.display = "none";
    app.style.display = "block";
    loadHistory();
}

// Envia a expressão matemática para a API calcular, e se for válida mostra o resultado e adiciona a operação no histórico
function calc() {
    const expression = display.value;

    ajax("POST", "/calculate",
        { expression },
        res => {
            if (res.result !== undefined) {
                display.value = res.result;
                historydiv.innerHTML += <div style="margin-top: 5px">${expression} = ${res.result}</div>
            } else {
                alert(res.error);
            }
        },
        true
    );
}

// Pede o histórico de operações do usuário atual
function loadHistory() {
    ajax("GET", "/history", null, res => {
        const hs = res
            .map(h => `<div style="margin-top: 5px">${h.expression} = ${h.result}</div>`)
            .join("");

        historydiv.innerHTML = hs;
        console.log(hs);
    }, true);
}