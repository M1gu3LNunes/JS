<?php
include "conexao.php"; // está na mesma pasta!

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $email   = trim($_POST['logEmail'] ?? '');
    $usuario = trim($_POST['logUsuario'] ?? '');
    $senha   = trim($_POST['logSenha'] ?? '');

    if ($email !== "" && $usuario !== "" && $senha !== "") {

        $sql = "SELECT * FROM usuarios WHERE email=? AND usuario=? AND senha=?";
        $stmt = $con->prepare($sql);
        $stmt->bind_param("sss", $email, $usuario, $senha);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            // Login OK → redireciona para a página inicial
            header("Location: ../index.html");
            exit();
        } else {
            $erro = "Dados inválidos.";
        }

    } else {
        $erro = "Preencha todos os campos.";
    }
}
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Login de Usuário - Biblioteca CEFET-RJ</title>
  <link rel="stylesheet" href="../css/estilo.css">
</head>

<body>

  <div class="container">
    <h1>Login de Usuário</h1>

    <section class="acoes">
      <h2>Informações do Usuário</h2>

      <form method="post">

        <input name="logEmail" type="email" placeholder="E-mail" required>
        <input name="logUsuario" type="text" placeholder="Usuário" required>
        <input name="logSenha" type="password" placeholder="Senha" required>

        <button type="submit">Logar</button>
      </form>

      <?php if (isset($erro)): ?>
        <p style="color:red;"><?= $erro ?></p>
      <?php endif; ?>

    </section>

    <div id="saidaLogin">
      <button class="btn-header" onclick="window.location.href='cadastro.php'">
        Cadastrar-se
      </button>
    </div>

  </div>
</body>
</html>




