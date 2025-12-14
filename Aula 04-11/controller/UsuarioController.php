<?php
require_once __DIR__ . "/GenericController.php";
require_once __DIR__ . "/../model/usuario.php";
class UsuarioController implements GenericController{
 private $conn;
public function __construct($conn){
    $this->conn = $conn;
}   
    function cadastrar($dadosRecebidos){
       $usuario = new Usuario(
        null,
        $dadosRecebidos->id,
        $dadosRecebidos->nome,
        $dadosRecebidos->senha
       );
       $usuario->cadastrar($this->conn);
    }
    function listar($filtro){
        return Usuario::listar($filtro, $this->conn);
    }
    function alterar($dadosRecebidos){
        $usuario= Usuario::pegaPorId($dadosRecebidos->id,$this->conn);
        $usuario->email= $dadosRecebidos->email;
        $usuario->senha= $dadosRecebidos->senha;
        $usuario->alterar($this->conn);
    }
    function remover($dadosRecebidos){
        $usuario = Usuario::pegaPorId($dadosRecebidos->id, $this->conn);
        $usuario->remover($this->conn);
    }
}

?>