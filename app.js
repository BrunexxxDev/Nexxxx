// app.js — Nexxx Studio refined (modal player + search + fetch)
document.addEventListener('DOMContentLoaded', () => {
  const API_URL = 'https://api.reidoscanais.io/channels'; // ajuste se necessário
  const dadosContainer = document.getElementById('dados-container');
  const statusEl = document.getElementById('status');
  const searchInput = document.getElementById('searchInput');

  // modal controls
  const modal = document.getElementById('modal');
  const modalOverlay = document.getElementById('modalOverlay');
  const modalClose = document.getElementById('modalClose');
  const playerWrapper = document.getElementById('playerWrapper');

  // utils
  /**
   * Sets the status message in the designated status element.
   * @param {string} html - The HTML string to be set as the status.
   */
  function setStatus(html) { statusEl.innerHTML = html; }

  /**
   * Opens the modal and loads an iframe with the given URL.
   * @param {string} url - The URL to be loaded in the iframe.
   */
  function openModalWithUrl(url) {
    // create iframe safely
    playerWrapper.innerHTML = '';
    const iframe = document.createElement('iframe');
    iframe.src = url;
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture';
    iframe.referrerPolicy = 'no-referrer';
    playerWrapper.appendChild(iframe);

    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    // trap focus (simple)
    modalClose.focus();
  }

  /**
   * Closes the modal and removes the iframe to stop playback.
   */
  function closeModal() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    // remove iframe to stop playback
    playerWrapper.innerHTML = '';
  }

  /**
   * Fetches channel data from the API, renders the channel cards, and handles loading/error states.
   */
  async function loadChannels() {
    try {
      setStatus('Carregando canais...');
      const res = await fetch(API_URL, { cache: 'no-store' });
      if (!res.ok) throw new Error('Status ' + res.status);
      const json = await res.json();
      if (!json || !Array.isArray(json.data)) throw new Error('Resposta inválida');

      const items = json.data.filter(it => it.is_active !== false && it.name && it.logo_url && it.embed_url);
      if (!items.length) {
        setStatus('Nenhum canal ativo encontrado.');
        dadosContainer.innerHTML = '';
        return;
      }

      // sort alpha
      items.sort((a,b) => (''+a.name).localeCompare((''+b.name)));

      dadosContainer.innerHTML = '';
      setStatus(`${items.length} canais disponíveis`);

      items.forEach(item => {
        const card = document.createElement('div');
        card.className = 'card';
        card.tabIndex = 0;
        // image
        const img = document.createElement('img');
        img.src = item.logo_url;
        img.alt = item.name;
        // fallback if image fails
        img.onerror = () => { img.src = 'imagens/fallback.png'; };
        card.appendChild(img);
        // title
        const title = document.createElement('div');
        title.className = 'title'; title.textContent = item.name;
        card.appendChild(title);
        // subtitle
        const sub = document.createElement('div'); sub.className = 'sub';
        sub.textContent = item.category || 'Ao vivo';
        card.appendChild(sub);

        // click / keyboard open modal
        card.addEventListener('click', () => openModalWithUrl(item.embed_url));
        card.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openModalWithUrl(item.embed_url); }});

        dadosContainer.appendChild(card);
      });
    } catch (err) {
      console.error('Erro ao carregar canais:', err);
      setStatus('Erro ao carregar canais. Verifique a API.');
      dadosContainer.innerHTML = `<div style="color:#ff7676;padding:16px;border-radius:10px;background:rgba(255,0,0,0.04)">Falha ao carregar os canais. Detalhe: ${err.message}</div>`;
    }
  }

  /**
   * Filters the displayed channel cards based on a search term.
   * @param {string} term - The search term to filter by.
   */
  function filterCards(term) {
    const cards = Array.from(dadosContainer.querySelectorAll('.card'));
    const t = term.trim().toLowerCase();
    if (!t) {
      cards.forEach(c => c.style.display = '');
      return;
    }
    cards.forEach(c => {
      const title = (c.querySelector('.title') || {}).textContent || '';
      c.style.display = title.toLowerCase().includes(t) ? '' : 'none';
    });
  }
  searchInput.addEventListener('input', (e) => filterCards(e.target.value));

  // modal events
  modalOverlay.addEventListener('click', closeModal);
  modalClose.addEventListener('click', closeModal);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
  });

  // initialize
  loadChannels();

  // footer year
  document.getElementById('year').textContent = new Date().getFullYear();
});