const URL ='https://rafaelescalfoni.github.io/desenv_web/filmes.json';

async function ChamarAPI() {
    const resp = await fetch(URL);

    if(resp.status == 200){
       const filmes = await resp.json();
       console.log(filmes);
       
       const container = document.getElementById("container");

       filmes.forEach(filme => {
            const card = document.createElement("div");
            card.classList.add("filme");

            let corClassificacao = "black"; 
            if (filme.classificacao <= 14) {
                corClassificacao = "green";
            } else if (filme.classificacao < 18) {
                corClassificacao = "gold";
            } else {
                corClassificacao = "red";
            }

            let opinioesHTML = "";
            if (filme.opinioes && filme.opinioes.length > 0) {
                opinioesHTML = `
                    <div class="opinioes">
                        <strong>Opiniões:</strong>
                        <ul>
                            ${filme.opinioes.map(op => {
                                const estrelas = "⭐".repeat(op.rating); 
                                return `<li>${estrelas} - ${op.descricao}</li>`;
                            }).join("")}
                        </ul>
                    </div>
                `;
            }

            card.innerHTML= `
                <img class="figura" src="${filme.figura}" alt="Poster de ${filme.titulo}" width="200">
                <h2 class="titulo">${filme.titulo}</h2>
                <p class="resumo"><strong>Resumo:</strong> ${filme.resumo}</p>
                <p class="generos"><strong>Gêneros:</strong> ${filme.generos.join(", ")}</p>
                <p class="classificacao" style="color:${corClassificacao}">
                    <strong>Classificação:</strong> ${filme.classificacao} anos
                </p>
                <p class="titulosSemelhantes"><strong>Semelhantes:</strong> ${filme.titulosSemelhantes.join(", ")}</p>
                ${opinioesHTML}
            `;

            container.appendChild(card);
        });
    }
} 

ChamarAPI();
