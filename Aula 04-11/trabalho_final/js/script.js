const btnListarTodosLivros = document.querySelector("#listarLivros");
const btnCadastrarLivro = document.querySelector("#cadastrarLivro");
const btnRegistrarRetirada = document.querySelector("#registrarRetirada");
const btnConsultarLivros = document.querySelector("#consultarLivros");
let livros = [];


function Livro(ISSN, titulo, autor, editora, anoPublicacao, genero, localizacao, disponibilidade) {
    this.ISSN = ISSN;
    this.titulo = titulo;
    this.autor = autor;
    this.editora = editora;
    this.anoPublicacao = anoPublicacao;
    this.genero = genero;
    this.localizacao = localizacao;
    this.disponibilidade = disponibilidade; 
}



async function cadastrarExemplar() {

    const novo = new Livro(
        document.getElementById("novoIssn").value,
        document.getElementById("novoTitulo").value,
        document.getElementById("novoAutor").value,
        document.getElementById("novoEditora").value,
        document.getElementById("novoAno").value,
        document.getElementById("novoGenero").value,
        document.getElementById("novoLocal").value
    );

    novo.disponibilidade = "Disponível";
    novo.disponivel = "Disponível";

    livros.push(novo);

    console.log("Cadastrado localmente: ", livros[livros.length - 1]);

    try {
        const resposta = await fetch("http://localhost/Aula%2004-11/index.php?modulo=livro&acao=inserir", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(novo)
        });

        if (resposta.ok) {
            const retorno = await resposta.json();
            console.log("Resposta do servidor (inserir):", retorno);

            alert("Livro cadastrado com sucesso!");

            await listarTodos();
        } else {
            console.warn("Servidor respondeu com status:", resposta.status);
            alert("Erro ao cadastrar (servidor retornou erro)");
        }
    } catch (err) {
        console.error("Erro ao enviar novo livro ao servidor:", err);
        alert("Ocorreu um erro na conexão ao cadastrar.");
    }
}




function consultarLivros() {
    const busca = (document.getElementById("busca").value || "").trim().toLowerCase();
    if (!busca) {
        console.log("Campo de busca vazio");
        return;
    }

    const resultados = livros.filter(l =>
        (l.titulo && l.titulo.toLowerCase().includes(busca)) ||
        (l.autor && l.autor.toLowerCase().includes(busca)) ||
        (l.genero && l.genero.toLowerCase().includes(busca))
    );

    console.log("Resultados da busca:", resultados);
    mostrarLista(resultados); 
}



let saidaBusca = document.getElementById("saidaBusca");

async function listarTodos() {
    try {
        const resposta = await fetch("http://localhost/Aula%2004-11/index.php?modulo=livro&filtro=");
        if (!resposta.ok) throw new Error(`HTTP error! status: ${resposta.status}`);
        const dados = await resposta.json();

        livros = dados;

        mostrarLista(livros);
        console.log("Dados carregados do servidor:", dados);
    } catch (err) {
        console.error("Erro ao listar livros:", err);
        saidaBusca.textContent = "Erro ao buscar dados. Veja console.";
    }
}


function mostrarLista(lista) {
    saidaBusca.innerHTML = "";
    if (!lista || lista.length === 0) {
        saidaBusca.innerHTML = "<p>Nenhum livro encontrado.</p>";
        return;
    }

    lista.forEach(item => {
        const issn = item.ISSN || item.issn || '-';
        const titulo = item.titulo || item.Titulo || '-';
        const autor = item.autor || item.Autor || '-';
        const editora = item.editora || '-';
        const anoPublicacao = item.anoPublicacao || item.ano || '-';
        const genero = item.genero || '-';
        const localizacao = item.local || item.localizacao || '-';
        const disponibilidade = item.disponibilidade || item.disponivel || '-';

        saidaBusca.innerHTML += `
          <div class="card-livro">
            <h4>${titulo}</h4>
            <p><strong>ISSN:</strong> ${issn}</p>
            <p><strong>Autor:</strong> ${autor}</p>
            <p><strong>Editora:</strong> ${editora} — <strong>Ano:</strong> ${anoPublicacao}</p>
            <p><strong>Gênero:</strong> ${genero}</p>
            <p><strong>Localização:</strong> ${localizacao}</p>
            <p><strong>Disponibilidade:</strong> ${disponibilidade}</p>
          </div>
        `;
    });
}


async function registrarRetirada() {
    const retirada = (document.getElementById("Retirada").value || "").trim();
    if (!retirada) {
        alert("Informe o título para retirada.");
        return;
    }

    // Aqui procura o livro já vindo do banco (lista atualizada)
    const selecionado = livros.find(
        livro => livro.titulo &&
                 livro.titulo.toLowerCase() === retirada.toLowerCase()
    );

    if (!selecionado) {
        alert("Livro não encontrado.");
        return;
    }

    // Muda só a disponibilidade
    selecionado.disponibilidade = "Indisponível";

    try {
        const resposta = await fetch("http://localhost/Aula%2004-11/index.php?modulo=livro", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(selecionado)
        });

        if (resposta.ok) {
            alert("Retirada registrada!");
            await listarTodos();
        } else {
            alert("Erro ao atualizar no servidor.");
        }

    } catch (err) {
        console.error("Erro:", err);
        alert("Falha de conexão.");
    }
}

async function alterarExemplar() {
    let tituloBusca = (document.getElementById("novoTitulo").value || "").trim();
    if (!tituloBusca) {
        tituloBusca = prompt("Informe o título (ou parte dele) do livro a ser alterado:");
        if (!tituloBusca) return;
        tituloBusca = tituloBusca.trim();
    }

    const busca = tituloBusca.toLowerCase();
    const matches = livros.filter(l => l.titulo && l.titulo.toLowerCase().includes(busca));
    if (!matches || matches.length === 0) {
        alert("Nenhum livro encontrado com esse título.");
        return;
    }

    let selecionado = matches[0];
    if (matches.length > 1) {
        const lista = matches.map((m, i) => `${i+1}: [id:${m.id||'-'}] ${m.titulo}`).join("\n");
        const escolha = prompt("Mais de um resultado encontrado. Cole o número do que deseja alterar:\n\n" + lista + "\n\n(pressione Cancel para usar o primeiro)");
        if (escolha) {
            const idx = parseInt(escolha, 10);
            if (!isNaN(idx) && idx >= 1 && idx <= matches.length) {
                selecionado = matches[idx-1];
            } else {
                alert("Escolha inválida — será usado o primeiro resultado.");
            }
        }
    }

    const issnVal = document.getElementById("novoIssn").value.trim();
    const tituloVal = document.getElementById("novoTitulo").value.trim();
    const autorVal = document.getElementById("novoAutor").value.trim();
    const editoraVal = document.getElementById("novoEditora").value.trim();
    const anoVal = document.getElementById("novoAno").value.trim();
    const generoVal = document.getElementById("novoGenero").value.trim();
    const localVal = document.getElementById("novoLocal").value.trim();
    const disponEl = document.getElementById("novoDisponibilidade");
    const disponVal = disponEl ? disponEl.value.trim() : "";

    if (issnVal) selecionado.ISSN = issnVal;
    if (tituloVal) selecionado.titulo = tituloVal;
    if (autorVal) selecionado.autor = autorVal;
    if (editoraVal) selecionado.editora = editoraVal;
    if (anoVal) selecionado.anoPublicacao = anoVal;
    if (generoVal) selecionado.genero = generoVal;
    if (localVal) selecionado.localizacao = localVal;
    if (disponVal !== "") selecionado.disponibilidade = disponVal;

    console.log("ENVIANDO PUT payload:", JSON.stringify(selecionado));

    try {
        const resposta = await fetch("http://localhost/Aula%2004-11/index.php?modulo=livro", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(selecionado)
        });

        const text = await resposta.text();
        console.log("STATUS PUT alterar:", resposta.status);
        console.log("RESPONSE PUT alterar:", text);

        if (resposta.ok) {
            await listarTodos();
            alert("Livro alterado com sucesso!");
            document.getElementById("novoIssn").value = "";
            document.getElementById("novoTitulo").value = "";
            document.getElementById("novoAutor").value = "";
            document.getElementById("novoEditora").value = "";
            document.getElementById("novoAno").value = "";
            document.getElementById("novoGenero").value = "";
            document.getElementById("novoLocal").value = "";
            if (disponEl) disponEl.value = "";
        } else {
            alert("Erro ao alterar (veja console).");
        }
    } catch (err) {
        console.error("Erro ao alterar livro:", err);
        alert("Erro de conexão ao alterar.");
    }
}
async function deletarExemplar() {
    const tituloCampo = (document.getElementById("deletarTitulo").value || "").trim();
    if (!tituloCampo) {
        alert("Informe o título do livro para deletar.");
        return;
    }

    const busca = tituloCampo.toLowerCase();
    const matches = livros.filter(l => l.titulo && l.titulo.toLowerCase().includes(busca));
    if (!matches || matches.length === 0) {
        alert("Nenhum livro encontrado com esse título.");
        return;
    }

    let selecionado = matches[0];
    if (matches.length > 1) {
        const lista = matches.map((m, i) => `${i+1}: [id:${m.id||'-'}] ${m.titulo}`).join("\n");
        const escolha = prompt("Mais de um resultado encontrado. Informe o número do que deseja deletar:\n\n" + lista + "\n\n(pressione Cancel para cancelar)");
        if (!escolha) return;
        const idx = parseInt(escolha, 10);
        if (isNaN(idx) || idx < 1 || idx > matches.length) {
            alert("Escolha inválida. Operação cancelada.");
            return;
        }
        selecionado = matches[idx - 1];
    }

    if (!('id' in selecionado) || !selecionado.id) {
        alert("O item selecionado não possui id, não é possível deletar.");
        return;
    }

    if (!confirm(`Confirmar exclusão do livro: "${selecionado.titulo}" (id: ${selecionado.id}) ?`)) return;

    try {
        const resposta = await fetch("http://localhost/Aula%2004-11/index.php?modulo=livro", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: selecionado.id })
        });

        if (resposta.ok) {
            await listarTodos();
            alert("Livro deletado com sucesso!");
            document.getElementById("deletarTitulo").value = "";
        } else {
            const text = await resposta.text();
            console.error("ERRO DELETE:", resposta.status, text);
            alert("Erro ao deletar (veja console).");
        }
    } catch (err) {
        console.error("Erro ao deletar:", err);
        alert("Erro de conexão ao deletar.");
    }
}

const btnDeletarLivro = document.querySelector("#btnDeletarLivro");
if (btnDeletarLivro) btnDeletarLivro.addEventListener("click", deletarExemplar);



const btnAlterarLivro = document.querySelector("#alterarLivro");
if (btnAlterarLivro) btnAlterarLivro.addEventListener("click", alterarExemplar);


btnCadastrarLivro.addEventListener("click", cadastrarExemplar);
btnConsultarLivros.addEventListener("click", consultarLivros);
btnListarTodosLivros.addEventListener("click", listarTodos);
btnRegistrarRetirada.addEventListener("click", registrarRetirada);
