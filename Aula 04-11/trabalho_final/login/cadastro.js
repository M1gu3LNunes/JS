document.addEventListener("DOMContentLoaded", () => {

    const btnCadastro = document.getElementById("btnCadastrarUsuario");
    if (btnCadastro) {
        btnCadastro.addEventListener("click", async () => {
            const email = document.getElementById("cadEmail").value;
            const usuario = document.getElementById("cadUsuario").value;
            const senha = document.getElementById("cadSenha").value;

            let dados = new FormData();
            dados.append("email", email);
            dados.append("usuario", usuario);
            dados.append("senha", senha);

            let req = await fetch("cadastrar.php", {
                method: "POST",
                body: dados
            });

            let resposta = await req.text();

            if (resposta === "OK") {
                alert("Usuário cadastrado!");
                window.location.href = "login.html";
            } else {
                alert("Erro: " + resposta);
            }
        });
    }

    const btnLogin = document.getElementById("btnLogarUsuario");
    if (btnLogin) {
        btnLogin.addEventListener("click", async () => {
            const email = document.getElementById("logEmail").value;
            const usuario = document.getElementById("logUsuario").value;
            const senha = document.getElementById("logSenha").value;

            let dados = new FormData();
            dados.append("email", email);
            dados.append("usuario", usuario);
            dados.append("senha", senha);

            let req = await fetch("login.php", {
                method: "POST",
                body: dados
            });

            let resposta = await req.text();

            if (resposta === "OK") {
                alert("Login realizado!");
            } else {
                alert("Credenciais inválidas.");
            }
        });
    }
});
