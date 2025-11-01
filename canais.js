document.addEventListener('DOMContentLoaded', function() {
    const dadosContainer = document.getElementById('dados-container');
    const playerContainer = document.getElementById('player-container');
    const closeButton = document.getElementById('close'); // Novo: Referência ao botão X
    
    // Texto original do player (mantido para restauração)
    const initialMessageHTML = '<p style="color: white; margin: 0; padding: 5px 0;">Clique em um canal para assistir.</p>';
    
    const EXPANDED_CLASS = 'player-expanded';
    const API_URL = 'https://api.reidoscanais.io/channels'; 

    function loadItems() {
        // 1. ESTADO DE CARREGAMENTO (LOADING STATE)
        dadosContainer.innerHTML = '<p style="color: #4CAF50; font-size: 1.2em; padding: 20px;">Carregando canais...</p>';

        fetch(API_URL)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Erro de rede ou status: ${response.status}`);
                }
                return response.json();
            })
            .then(result => {
                // 2. VALIDAÇÃO DA ESTRUTURA DA API
                if (!result.success || !Array.isArray(result.data)) {
                    throw new Error('Formato de dados da API inválido ou falha na resposta (success: false).');
                }
                
                const rawData = result.data;
                
                // Filtra e valida os itens
                const filteredData = rawData.filter(item => 
                    item.is_active !== false && // Filtra inativos
                    item.name && item.logo_url && item.embed_url // Valida campos essenciais
                );
                
                // Ordenação alfabética
                filteredData.sort((a, b) => {
                    const nameA = a.name.toString();
                    const nameB = b.name.toString();
                    return nameA.localeCompare(nameB);
                });
                
                dadosContainer.innerHTML = ''; // Limpa o loading
                
                // 3. CRIAÇÃO DOS ELEMENTOS (Iteração otimizada)
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

                    // LÓGICA DE CLIQUE
                    itemDiv.addEventListener('click', function() {
                        const targetUrl = item.embed_url; 
                        
                        // 1. Limpa o container
                        playerContainer.innerHTML = ''; 
                        
                        // 2. CRIA O NOVO IFRAME
                        const iframe = document.createElement('iframe');
                        iframe.src = targetUrl;
                        iframe.allow = "fullscreen";
                        iframe.allowFullscreen = true; 
                        iframe.setAttribute('frameborder', '0'); // Prática comum para iframes de embed
                        
                        playerContainer.appendChild(iframe); 
                        
                        // 3. GATILHO DA ANIMAÇÃO E BOTÃO DE FECHAR (CSS cuida do botão)
                        playerContainer.classList.add(EXPANDED_CLASS); 
                    });
                });

                // Se não houver itens válidos
                if (filteredData.length === 0) {
                    dadosContainer.innerHTML = '<p style="color: #f0f0f0; font-size: 1.2em; padding: 20px;">Nenhum canal ativo foi encontrado.</p>';
                }

            })
            .catch(error => {
                console.error('Erro ao carregar os canais da API:', error);
                // 4. MENSAGEM DE ERRO VISÍVEL AO USUÁRIO
                dadosContainer.innerHTML = `<p style="color: red; font-weight: bold; padding: 20px;">
                    Falha ao carregar os canais. Verifique a API. Detalhe: ${error.message}
                </p>`;
            });
    }
    
    // Chama a função principal
    loadItems();
    
    // Função de busca (mantida)
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
    
    // 5. FUNÇÃO closePlayer AGORA ESTÁ NO ESCOPO GLOBAL E LIMPA O ESTADO
    window.closePlayer = function() { 
        const playerContainer = document.getElementById('player-container');
        
        // Remove a classe de expansão (ocultando o botão X via CSS)
        playerContainer.classList.remove(EXPANDED_CLASS);
        
        // Limpa o player (remove o iframe) e insere a mensagem inicial novamente.
        // Usa setTimeout para dar tempo da transição do CSS acontecer (melhor UX)
        setTimeout(() => {
            playerContainer.innerHTML = initialMessageHTML;
        }, 300); // 300ms, deve coincidir com a duração da transição no CSS
    }

});
