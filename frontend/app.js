const API = "http://localhost:3000";

let token = localStorage.getItem("token");

if (token) showApp();

function add(v) {
    document.getElementById("display").value += v;
}

function clearD() {
    document.getElementById("display").value = "";
}

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

function logout() {
    localStorage.removeItem("token");
    location.reload();
}

function showApp() {
    auth.style.display = "none";
    app.style.display = "block";
    loadHistory();
}

function calc() {
    const expression = display.value;

    ajax("POST", "/calculate",
        { expression },
        res => {
            if (res.result !== undefined) {
                display.value = res.result;
                loadHistory();
            } else {
                alert(res.error);
            }
        },
        true
    );
}

function loadHistory() {
    ajax("GET", "/history", null, res => {
        const hs = res
            .map(h => `<div style="margin-top: 5px">${h.expression} = ${h.result}</div>`)
            .join("");

        historydiv.innerHTML = hs;
        console.log(hs);
    }, true);
}