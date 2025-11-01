document.addEventListener('DOMContentLoaded', function() {
    const dadosContainer = document.getElementById('dados-container');
    const playerContainer = document.getElementById('player-container');
    
    // Referência à mensagem inicial para reinserção (o CSS não precisa de ID)
    const initialMessage = playerContainer.querySelector('p'); 
    
    const EXPANDED_CLASS = 'player-expanded';

    function loadItems() {
        fetch('canais.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                const filteredData = data.filter(item => item.is_active !== false);
                
                filteredData.sort((a, b) => {
                    const nameA = a.name ? a.name.toString() : '';
                    const nameB = b.name ? b.name.toString() : '';
                    return nameA.localeCompare(nameB);
                });
                
                dadosContainer.innerHTML = '';
                
                filteredData.forEach(item => {
                    const itemDiv = document.createElement('div');
                    itemDiv.classList.add('item');
                    itemDiv.style.cursor = 'pointer'; 
                    
                    const imagem = document.createElement('img');
                    imagem.src = item.logo_url;
                    imagem.alt = item.name;
                    itemDiv.appendChild(imagem);
                    
                    const nomeParagrafo = document.createElement('p');
                    nomeParagrafo.textContent = item.name;
                    nomeParagrafo.classList.add('nome'); 
                    itemDiv.appendChild(nomeParagrafo);
                    
                    dadosContainer.appendChild(itemDiv);

                    // LÓGICA DE CLIQUE: RECRIAR O IFRAME E EXPANDIR
                    itemDiv.addEventListener('click', function() {
                        const targetUrl = item.embed_url || item.link; 
                        
                        if (targetUrl) {
                            // 1. Limpa o container (remove a mensagem ou iframe anterior)
                            playerContainer.innerHTML = ''; 
                            
                            // 2. CRIA O NOVO IFRAME (força o recarregamento)
                            const iframe = document.createElement('iframe');
                            iframe.src = targetUrl;
                            iframe.allow = "fullscreen";
                            iframe.allowFullscreen = true; 
                            
                            playerContainer.appendChild(iframe); 
                            
                            // 3. GATILHO DA ANIMAÇÃO
                            playerContainer.classList.add(EXPANDED_CLASS); 
                        }
                    });
                });
            })
            .catch(error => {
                console.error('Erro ao carregar ou processar os dados:', error);
                dadosContainer.innerHTML = `<p style="color: red;">Erro ao carregar os canais. Verifique se 'dados.json' está correto.</p>`;
            });
    }
    
    loadItems();
    
    // Função de busca
    window.searchItems = function() {
        const searchTerm = document.getElementById('searchInput').value.toLowerCase();
        const items = document.querySelectorAll('.item');
        
        items.forEach(item => {
            const nomeElement = item.querySelector('.nome');
            let itemName = '';

            if (nomeElement) {
                itemName = nomeElement.textContent.toLowerCase();
            }
            
            if (itemName.includes(searchTerm)) {
                item.style.display = 'flex'; 
            } else {
                item.style.display = 'none';
            }
        });
    }
    
    searchItems(); 
});
                                             
function closePlayer() { 
    const playerContainer = document.getElementById('player-container');
    // O texto original que deve ser restaurado.
    const initialMessageHTML = '<p style="color: white; margin: 0; padding: 5px 0;">Clique em um canal para assistir.</p>';
    
    // Limpa o player (remove o iframe) e insere a mensagem inicial novamente.
    playerContainer.innerHTML = '';
    playerContainer.innerHTML = initialMessageHTML;
    
    // Remove a classe de expansão
    playerContainer.classList.remove('player-expanded');
}
