const apiKey = '1edff9b7';
const frmPesquisa = document.querySelector("form");
const favoritosContainer = document.querySelector("div.favoritos");
const detalhesContainer = document.createElement('div'); // Contêiner para exibir os detalhes
document.body.appendChild(detalhesContainer); // Adiciona o contêiner ao body

document.addEventListener("DOMContentLoaded", () => {
    // Carrega os favoritos quando a página é carregada
    carregaFavoritos();
});

frmPesquisa.onsubmit = (ev) => {
    ev.preventDefault();
    
    const pesquisa = ev.target.pesquisa.value;

    if (pesquisa === "") {
        alert('Preencha o campo!');
        return;
    }

    fetch(`https://www.omdbapi.com/?s=${pesquisa}&apikey=${apiKey}`)
        .then(result => result.json())
        .then(json => carregaLista(json));
}

const carregaLista = (json) => {
    const listra = document.querySelector("div.lista");
    listra.innerHTML = "";

    if (!json.Search) {
        listra.innerHTML = "<p>Nenhum filme encontrado.</p>";
        return;
    }

    json.Search.forEach(element => {
        let item = document.createElement("div");
        item.classList.add("item");
        
        // Exibindo a imagem do poster, título do filme e botão de favoritar
        item.innerHTML = `
            <img src="${element.Poster}" alt="${element.Title}" />
            <h2>${element.Title}</h2>
            <button class="favoritar">Favoritar</button>
        `;

        const btnFavoritar = item.querySelector(".favoritar");
        btnFavoritar.onclick = () => favoritarFilme(element);

        // Adicionando evento de clique para exibir detalhes
        item.onclick = () => exibirDetalhes(element);

        listra.appendChild(item);
    });
}

const exibirDetalhes = (filme) => {
    // Atualizar o conteúdo do contêiner de detalhes
    detalhesContainer.innerHTML = `
        <h2>${filme.Title} (Detalhes)</h2>
        <img src="${filme.Poster}" alt="${filme.Title}" />
        <p><strong>Ano:</strong> ${filme.Year}</p>
        <p><strong>Tipo:</strong> ${filme.Type}</p>
        <p><strong>ID IMDb:</strong> ${filme.imdbID}</p>
    `;
    detalhesContainer.classList.add('detalhes');
}

const favoritarFilme = (filme) => {
    let filmesFavoritos = JSON.parse(localStorage.getItem('favoritos')) || [];
    
    const jaFavoritado = filmesFavoritos.some(f => f.imdbID === filme.imdbID);

    if (!jaFavoritado) {
        filmesFavoritos.push(filme);
        localStorage.setItem('favoritos', JSON.stringify(filmesFavoritos));
        alert(`${filme.Title} foi adicionado aos favoritos!`);
    } else {
        alert(`${filme.Title} já está nos favoritos.`);
    }

    carregaFavoritos();
}

const carregaFavoritos = () => {
    let filmesFavoritos = JSON.parse(localStorage.getItem('favoritos')) || [];
    
    favoritosContainer.innerHTML = "<h3>Favoritos:</h3>";

    if (filmesFavoritos.length === 0) {
        favoritosContainer.innerHTML += "<p>Nenhum favorito salvo.</p>";
        return;
    }

    filmesFavoritos.forEach(filme => {
        let itemFavorito = document.createElement("div");
        itemFavorito.classList.add("item-favorito");
        
        itemFavorito.innerHTML = `
            <img src="${filme.Poster}" alt="${filme.Title}" />
            <h2>${filme.Title}</h2>
            <button class="remover-favorito">Remover</button>
        `;

        const btnRemover = itemFavorito.querySelector(".remover-favorito");
        btnRemover.onclick = () => removerFavorito(filme.imdbID);

        favoritosContainer.appendChild(itemFavorito);
    });
}

const removerFavorito = (imdbID) => {
    let filmesFavoritos = JSON.parse(localStorage.getItem('favoritos')) || [];

    filmesFavoritos = filmesFavoritos.filter(f => f.imdbID !== imdbID);

    localStorage.setItem('favoritos', JSON.stringify(filmesFavoritos));

    carregaFavoritos();
}
