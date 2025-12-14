<?php
include "conexao.php";

$mensagem = "";

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $email   = trim($_POST["email"] ?? '');
    $usuario = trim($_POST["usuario"] ?? '');
    $senha   = trim($_POST["senha"] ?? '');

    if ($email !== "" && $usuario !== "" && $senha !== "") {

        $sql = "INSERT INTO usuarios (usuario, email, senha) VALUES (?, ?, ?)";
        $stmt = $con->prepare($sql);
        $stmt->bind_param("sss", $usuario, $email, $senha);

        if ($stmt->execute()) {
            // cadastrado com sucesso
            header("Location: login.php");
            exit();
        } else {
            $mensagem = "Erro ao cadastrar: " . $stmt->error;
        }

    } else {
        $mensagem = "Preencha todos os campos.";
    }
}
?>
<!DOCTYPE html>
<html lang="pt-BR">

<head>
  <meta charset="UTF-8">
  <title>Cadastro de Usuário - Biblioteca CEFET-RJ</title>
  <link rel="stylesheet" href="../css/estilo.css">
</head>

<body>
  <div class="container">
    <h1>Cadastrar Usuário</h1>

    <section class="acoes">
      <h2>Informações do Usuário</h2>

      <form method="post">

        <input name="email" type="email" placeholder="E-mail" required>
        <input name="usuario" type="text" placeholder="Usuário" required>
        <input name="senha" type="password" placeholder="Senha" required>

        <button type="submit">Cadastrar</button>
      </form>

      <?php if ($mensagem !== ""): ?>
        <p style="color:red;"><?= $mensagem ?></p>
      <?php endif; ?>

    </section>

    <button class="btn-header" onclick="window.location.href='login.php'">
      Voltar ao Login
    </button>

  </div>
</body>
</html>
