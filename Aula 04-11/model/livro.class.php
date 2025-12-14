<?php
require_once __DIR__ . "/classe_pai.php";
class Livro extends ClassePai {

    public $titulo;
    public $autor;
    public $editora;
    public $anoPublicacao;
    public $genero;
    public $localizacao;
    public $ISSN;
    public $disponibilidade;

    public function toEntity($dados){
        return new Livro(
            $dados[0],
            $dados[1],
            $dados[2],
            $dados[3],
            $dados[4],
            $dados[5],
            $dados[6],
            $dados[7],
            $dados[8]
        );
    }

    public function cadastrar($conn){
        $SQL = "INSERT INTO livros (titulo, autor, editora, anoPublicacao, genero, localizacao, ISSN, disponibilidade) VALUES (?,?,?,?,?,?,?,?)";
        $stmt = $conn->prepare($SQL);
        $stmt->bind_param(
            "ssssssss",
            $this->titulo,
            $this->autor,
            $this->editora,
            $this->anoPublicacao,
            $this->genero,
            $this->localizacao,
            $this->ISSN,
            $this->disponibilidade
        );
        $resultado = $stmt->execute();
        if($resultado){
            $this->id = $conn->insert_id;
        }
        $stmt->close();
    }

    public function alterar($conn){
        $SQL = "UPDATE livros SET 
            titulo = ?, autor = ?, editora = ?, anoPublicacao = ?, genero = ?, localizacao = ?, ISSN = ?, disponibilidade = ?
            WHERE id = ?";
        $stmt = $conn->prepare($SQL);
        $stmt->bind_param(
            "ssssssssi",
            $this->titulo,
            $this->autor,
            $this->editora,
            $this->anoPublicacao,
            $this->genero,
            $this->localizacao,
            $this->ISSN,
            $this->disponibilidade,
            $this->id
        );
        $stmt->execute();
        $stmt->close();
    }

    static public function pegaPorId($id, $conn) {
        $SQL = "SELECT * FROM livros WHERE id = ?";
        $stmt = $conn->prepare($SQL);
        if(!$stmt) return null;
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $res = $stmt->get_result();
        if($dados = $res->fetch_assoc()){
            $stmt->close();
            return new Livro(
                $dados['id'],
                $dados['titulo'],
                $dados['autor'],
                $dados['editora'],
                $dados['anoPublicacao'],
                $dados['genero'],
                $dados['localizacao'],
                $dados['ISSN'],
                $dados['disponibilidade']
            );
        }
        $stmt->close();
        return null;
    }

    public function __construct($id, $titulo, $autor, $editora, $anoPublicacao, $genero, $localizacao, $ISSN, $disponibilidade) {
        parent::__construct($id, "database/livros.txt");
        $this->titulo = $titulo;
        $this->autor = $autor;
        $this->editora = $editora;
        $this->anoPublicacao = $anoPublicacao;
        $this->genero = $genero;
        $this->localizacao = $localizacao;
        $this->ISSN = $ISSN;
        $this->disponibilidade= $disponibilidade;
    }

    static public function listar($filtroNome, $conn) {
        $term = "";
        if (is_array($filtroNome) && isset($filtroNome['filtro'])) {
            $term = $filtroNome['filtro'];
        } elseif (is_object($filtroNome) && isset($filtroNome->filtro)) {
            $term = $filtroNome->filtro;
        } elseif (is_string($filtroNome)) {
            $term = $filtroNome;
        }

        $SQL = "SELECT * FROM livros WHERE titulo LIKE CONCAT('%', ?, '%')";
        $stmt = $conn->prepare($SQL);
        if(!$stmt) return [];
        $stmt->bind_param("s", $term);
        $stmt->execute();
        $res = $stmt->get_result();

        $retorno = [];
        while($dados = $res->fetch_assoc()){
            $livro = new Livro(
                $dados['id'],
                $dados['titulo'],
                $dados['autor'],
                $dados['editora'],
                $dados['anoPublicacao'],
                $dados['genero'],
                $dados['localizacao'],
                $dados['ISSN'],
                $dados['disponibilidade']
            );
            array_push($retorno, $livro);
        }
        $stmt->close();
        return $retorno;
    }

    function montaLinhaDados()
    {
        return $this->id.self::SEPARADOR.
               $this->titulo.self::SEPARADOR.
               $this->autor.self::SEPARADOR.
               $this->editora.self::SEPARADOR.
               $this->anoPublicacao.self::SEPARADOR.
               $this->genero.self::SEPARADOR.
               $this->localizacao.self::SEPARADOR.
               $this->ISSN.self::SEPARADOR.
               $this->disponibilidade;
    }

    public function remover($conn)
    {
    $SQL = "DELETE FROM livros WHERE id = ?";
    $stmt = $conn->prepare($SQL);
    $stmt->bind_param("i", $this->id);
    $stmt->execute();
    $stmt->close();
}

}
?>
