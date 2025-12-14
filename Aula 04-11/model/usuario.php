<?php
require_once __DIR__ . "/classe_pai.php";

class Usuario extends ClassePai{

public $id;
public $email;
public $senha;

public function ToEntity($dados){
 return new Usuario(
    $dados[0],
    $dados[1],
    $dados[2]
 );
}

public function Cadastrar($conn){
    $SQL="INSERT INTO usuario (email,senha) VALUES(
    
    email='$this->email',
    senha='$this->senha'
    
    )";
    $resultado = $conn->query($SQL);
    if($resultado){
        $this->id = $conn->insert_id;
}
} 
public function Alterar($conn){
     $SQL="UPDATE usuario set
     '$this->id',
     '$this->email',
     '$this->senha',
     WHERE id = $this->id";
     $conn-> query($SQL);
}

    static public function PegaPorId($id, $conn){
        $SQL="SELECT* FROM livros WHERE id=$id";
        $resultado =$conn->mysql_query($SQL);
        if($resultado){
            $dados = $conn->fetch_array($resultado);
            return new Usuario(
                $dados['id'],
                $dados['email'],
                $dados['senha'],
            ); 
        }
    }
    public function _construct($id, $email, $senha){
            $this->id= $id;
            $this->email= $email;
            $this->senha= $senha;
    }

    static public function listar($filtroNome,$conn){
        $SQL="SELECT * FROM usuario WHERE nome '%".$filtroNome["filtro"]."%'";
        $resultado = $conn-> query($SQL);
        $retorno =[];
        while($dados = $resultado->fetch_array()){
            $usuario = new Usuario(
                $dados['id'],
                $dados['email'],
                $dados['senha']
            );
            array_push($retorno,$usuario);
        }
        return $retorno;
    }
        function montaLinhaDados()
        {
            return $this->id.self::SEPARADOR.
                   $this->email.self::SEPARADOR.
                   $this->senha;
        }
  }