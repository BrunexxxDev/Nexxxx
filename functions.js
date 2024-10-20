document.addEventListener('DOMContentLoaded', function() {
    // Selecionar o contêiner onde os dados serão exibidos
    const dadosContainer = document.getElementById('dados-container');
    
    // Função para carregar e exibir os itens
    function loadItems() {
        // Carregar os dados do arquivo JSON
        fetch('dados.json')
            .then(response => response.json())
            .then(data => {
                // Filtrar os dados para excluir os itens com status "off"
                const filteredData = data.filter(item => item.status !== "off");
                
                // Ordenar os dados filtrados em ordem alfabética pelo nome
                filteredData.sort((a, b) => a.nome.localeCompare(b.nome));
                
                // Limpar o contêiner antes de exibir os itens
                dadosContainer.innerHTML = '';
                
                // Iterar sobre os dados filtrados e criar elementos HTML para cada item
                filteredData.forEach(item => {
                    // Criar e exibir cada item
                    const itemDiv = document.createElement('div');
                    itemDiv.classList.add('item');
                    
                    // Criar uma imagem para cada item
                    const imagem = document.createElement('img');
                    imagem.src = item.imagem;
                    imagem.alt = item.nome;
                    
                    // Adicionar a imagem à div do item
                    itemDiv.appendChild(imagem);
                    
                    // Criar uma div para o nome e o status
                    const infoDiv = document.createElement('div');
                    infoDiv.classList.add('info');
                    
                    // Criar um parágrafo para exibir o nome do item
                    const nomeParagrafo = document.createElement('p');
                    nomeParagrafo.textContent = item.nome;
                    nomeParagrafo.classList.add('nome');
                    
                    // Criar um parágrafo para exibir o status do item
                    const statusParagrafo = document.createElement('p');
                    statusParagrafo.textContent = item.status;
                    statusParagrafo.classList.add('status');
                    
                    // Adicionar o nome e o status à div de informações
                    infoDiv.appendChild(nomeParagrafo);
                    
                    
                    // Adicionar a div de informações à div do item
                    itemDiv.appendChild(infoDiv);
                    
                    // Adicionar a div do item ao contêiner
                    dadosContainer.appendChild(itemDiv);

                    // Adicionar um evento de clique para abrir o link em uma nova aba
                    itemDiv.addEventListener('click', function() {
                        window.open(item.link, '_blank');
                    });
                });
            })
            .catch(error => console.error('Erro ao carregar os dados:', error));
    }
    
    // Chamar a função para carregar e exibir os itens
    loadItems();
    
    // Função para pesquisar itens
    function searchItems() {
        const searchTerm = document.getElementById('searchInput').value.toLowerCase();
        
        // Selecionar todos os itens
        const items = document.querySelectorAll('.item');
        
        // Iterar sobre os itens e mostrar/ocultar de acordo com o termo de pesquisa
        items.forEach(item => {
            const itemName = item.querySelector('.nome').textContent.toLowerCase();
            if (itemName.includes(searchTerm)) {
                item.style.display = 'block'; // Mostrar o item
            } else {
                item.style.display = 'none'; // Ocultar o item
            }
        });
    }
    
    // Adicionar um evento de digitação ao campo de pesquisa
    document.getElementById('searchInput').addEventListener('keyup', searchItems);
});