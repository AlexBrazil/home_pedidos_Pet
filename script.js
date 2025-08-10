// Lista de estados brasileiros
const estadosBrasileiros = [
  { sigla: 'AC', nome: 'Acre' },
  { sigla: 'AL', nome: 'Alagoas' },
  { sigla: 'AP', nome: 'Amapá' },
  { sigla: 'AM', nome: 'Amazonas' },
  { sigla: 'BA', nome: 'Bahia' },
  { sigla: 'CE', nome: 'Ceará' },
  { sigla: 'DF', nome: 'Distrito Federal' },
  { sigla: 'ES', nome: 'Espírito Santo' },
  { sigla: 'GO', nome: 'Goiás' },
  { sigla: 'MA', nome: 'Maranhão' },
  { sigla: 'MT', nome: 'Mato Grosso' },
  { sigla: 'MS', nome: 'Mato Grosso do Sul' },
  { sigla: 'MG', nome: 'Minas Gerais' },
  { sigla: 'PA', nome: 'Pará' },
  { sigla: 'PB', nome: 'Paraíba' },
  { sigla: 'PR', nome: 'Paraná' },
  { sigla: 'PE', nome: 'Pernambuco' },
  { sigla: 'PI', nome: 'Piauí' },
  { sigla: 'RJ', nome: 'Rio de Janeiro' },
  { sigla: 'RN', nome: 'Rio Grande do Norte' },
  { sigla: 'RS', nome: 'Rio Grande do Sul' },
  { sigla: 'RO', nome: 'Rondônia' },
  { sigla: 'RR', nome: 'Roraima' },
  { sigla: 'SC', nome: 'Santa Catarina' },
  { sigla: 'SP', nome: 'São Paulo' },
  { sigla: 'SE', nome: 'Sergipe' },
  { sigla: 'TO', nome: 'Tocantins' }
];

// Função para popular select de estados
function popularEstados(selectId) {
  const select = document.getElementById(selectId);
  
  // Limpar opções existentes (exceto a primeira)
  select.innerHTML = '<option value="">Selecione o Estado</option>';
  
  // Adicionar estados dinamicamente
  estadosBrasileiros.forEach(estado => {
    const option = document.createElement('option');
    option.value = estado.sigla;
    option.textContent = estado.nome;
    select.appendChild(option);
  });
}

// Função para trocar imagens baseado no tamanho da tela
function trocarImagensResponsivas() {
  const isMobile = window.innerWidth <= 768;
  
  // Trocar banner
  const bannerImg = document.querySelector('.hero img[alt="Pets esperando ajuda"]');
  if (bannerImg) {
    bannerImg.src = isMobile ? 'image/banner2.png' : 'image/banner.png';
  }
  
  // Trocar storyboard
  const storyboardImg = document.querySelector('img[alt="Como ajudar?"]');
  if (storyboardImg) {
    storyboardImg.src = isMobile ? 'image/storyboard2.png' : 'image/storyboard.png';
  }
}

// Inicializar quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
  popularEstados('estado');
  popularEstados('estadoCoordenador');
  
  // Trocar imagens baseado no tamanho da tela
  trocarImagensResponsivas();
  
  // <<< INSERÇÃO INÍCIO: Adiciona o listener para o botão de transparência >>>
  const transparenciaBtn = document.getElementById('transparenciaBtn');
  if (transparenciaBtn) {
    transparenciaBtn.addEventListener('click', function(event) {
      event.preventDefault(); // Impede que o link '#' recarregue a página
      openTransparenciaModal();
    });
  }
  // <<< INSERÇÃO FIM >>>

  // Inicializa o carrossel apenas se o elemento existir na página
  if (document.querySelector('.carousel-container')) {
    initCarousel();
  }
});

// Escutar mudanças no tamanho da tela
window.addEventListener('resize', trocarImagensResponsivas);

// Funções para Modal Fornecedor
function openModal() {
  document.getElementById('fornecedorModal').style.display = 'block';
}

function closeModal() {
  document.getElementById('fornecedorModal').style.display = 'none';
}

// Funções para Modal Coordenador
function openCoordenadorModal() {
  document.getElementById('coordenadorModal').style.display = 'block';
}

function closeCoordenadorModal() {
  document.getElementById('coordenadorModal').style.display = 'none';
}

// <<< INSERÇÃO INÍCIO: Funções para o novo Modal de Transparência >>>
function openTransparenciaModal() {
  document.getElementById('transparenciaModal').style.display = 'block';
  carregarDadosTransparencia(); // Chama a função para carregar os dados
}

function closeTransparenciaModal() {
  document.getElementById('transparenciaModal').style.display = 'none';
}
// <<< INSERÇÃO FIM >>>

// Fechar modals clicando fora delas
window.onclick = function(event) {
  const fornecedorModal = document.getElementById('fornecedorModal');
  const coordenadorModal = document.getElementById('coordenadorModal');
  const transparenciaModal = document.getElementById('transparenciaModal'); // <<< INSERÇÃO

  if (event.target == fornecedorModal) {
    fornecedorModal.style.display = 'none';
  }
  if (event.target == coordenadorModal) {
    coordenadorModal.style.display = 'none';
  }
  if (event.target == transparenciaModal) { // <<< INSERÇÃO
    transparenciaModal.style.display = 'none'; // <<< INSERÇÃO
  } // <<< INSERÇÃO
}

async function submitForm(event) {
  event.preventDefault();
  
  const formData = new FormData(event.target);
  const data = Object.fromEntries(formData);
  
  const submitButton = event.target.querySelector('button[type="submit"]');
  const originalText = submitButton.textContent;
  
  const webhookData = {
    body: {
      data: {
        messageType: 'cadastro_site',
        tipo: 'fornecedor',
        nomeComercial: data.nomeComercial,
        nomeContato: data.nomeContato,
        cidade: data.cidade,
        estado: data.estado,
        celular: data.celular,
        timestamp: new Date().toISOString(),
        origem: 'site_pedidos_pet'
      }
    }
  };
  
  try {
    submitButton.textContent = 'Enviando...';
    submitButton.disabled = true;
    
    const response = await fetch('https://automatiz-n8n-webhook.dp51xv.easypanel.host/webhook/a5af5896-4ac6-43ce-b1e2-7ffa8a43b55b', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(webhookData)
    });
    
    if (response.ok) {
      submitButton.textContent = originalText;
      submitButton.disabled = false;
      closeModal();
      alert('Cadastro enviado com sucesso! Entraremos em contato em breve.');
      event.target.reset();
    } else {
      throw new Error(`Erro HTTP: ${response.status}`);
    }
    
  } catch (error) {
    console.error('Erro ao enviar cadastro:', error);
    alert('Erro ao enviar cadastro. Tente novamente ou entre em contato conosco.');
    if (submitButton) {
      submitButton.textContent = originalText;
      submitButton.disabled = false;
    }
  }
}

async function submitCoordenadorForm(event) {
  event.preventDefault();
  
  const formData = new FormData(event.target);
  const data = Object.fromEntries(formData);
  
  const submitButton = event.target.querySelector('button[type="submit"]');
  const originalText = submitButton.textContent;
  
  const webhookData = {
    body: {
      data: {
        messageType: 'cadastro_site',
        tipo: 'coordenador',
        nomeComercial: 'indefinido',
        nomeContato: data.nomeContato,
        cidade: data.cidade,
        estado: data.estado,
        celular: data.celular,
        timestamp: new Date().toISOString(),
        origem: 'site_pedidos_pet'
      }
    }
  };
  
  try {
    submitButton.textContent = 'Enviando...';
    submitButton.disabled = true;
    
    const response = await fetch('https://automatiz-n8n-webhook.dp51xv.easypanel.host/webhook/a5af5896-4ac6-43ce-b1e2-7ffa8a43b55b', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(webhookData)
    });
    
    if (response.ok) {
      submitButton.textContent = originalText;
      submitButton.disabled = false;
      closeCoordenadorModal();
      alert('Cadastro enviado com sucesso! Entraremos em contato em breve.');
      event.target.reset();
    } else {
      throw new Error(`Erro HTTP: ${response.status}`);
    }
    
  } catch (error) {
    console.error('Erro ao enviar cadastro:', error);
    alert('Erro ao enviar cadastro. Tente novamente ou entre em contato conosco.');
    if (submitButton) {
      submitButton.textContent = originalText;
      submitButton.disabled = false;
    }
  }
}

// <<< INSERÇÃO INÍCIO: Função para carregar e exibir os dados de transparência >>>
async function carregarDadosTransparencia() {
  const container = document.getElementById('tabela-container');
  const tituloModal = document.getElementById('titulo-transparencia');
  
  // Reseta o conteúdo e o título para o estado de carregamento
  container.innerHTML = '<p>Carregando dados...</p>';
  tituloModal.textContent = 'Transparência do Projeto';

  try {
    const response = await fetch('transparencia-data.json');
    if (!response.ok) {
      throw new Error(`Erro na rede: ${response.statusText}`);
    }
    const data = await response.json(); // Agora 'data' é o objeto completo

    const mesReferencia = data.mes_referencia;
    const doacoes = data.doacoes; // 'doacoes' é o array

    // Atualiza o título da modal se o mês de referência existir
    if (mesReferencia) {
      tituloModal.textContent = `Transparência - ${mesReferencia}`;
    }

    if (!doacoes || doacoes.length === 0) {
      container.innerHTML = '<p>Nenhuma doação registrada para este período.</p>';
      return;
    }

    // Constrói a tabela HTML como uma string
    let tabelaHTML = '<table class="tabela-transparencia"><thead><tr><th>Doador</th><th>Doação</th></tr></thead><tbody>';

    doacoes.forEach(item => {
      // Sanitização simples para evitar problemas de HTML
      const doadorSeguro = item.doador.replace(/</g, "&lt;").replace(/>/g, "&gt;");
      const doacaoSegura = item.doacao.replace(/</g, "&lt;").replace(/>/g, "&gt;");
      tabelaHTML += `<tr><td>${doadorSeguro}</td><td>${doacaoSegura}</td></tr>`;
    });

    tabelaHTML += '</tbody></table>';

    // Insere a tabela completa no container
    container.innerHTML = tabelaHTML;

  } catch (error) {
    console.error('Falha ao carregar dados de transparência:', error);
    container.innerHTML = '<p style="color: red;">Não foi possível carregar os dados. Tente novamente mais tarde.</p>';
  }
}
// <<< INSERÇÃO FIM >>>


// ===================================================================
// == INÍCIO DO CÓDIGO DO CARROSSEL DE FOTOS (VERSÃO JSON) ===========
// ===================================================================
async function initCarousel() {
  const track = document.querySelector('.carousel-track');
  const prevButton = document.querySelector('.carousel-button.prev');
  const nextButton = document.querySelector('.carousel-button.next');
  const container = document.querySelector('.carousel-container');

  let carouselData = [];

  try {
    const response = await fetch('carousel-data.json');
    if (!response.ok) {
        throw new Error(`Erro ao buscar o arquivo: ${response.statusText}`);
    }
    carouselData = await response.json();
  } catch (error) {
    console.error("Falha ao carregar dados do carrossel:", error);
    const carouselSection = document.getElementById('historias-de-sucesso');
    if(carouselSection) carouselSection.style.display = 'none'; 
    return;
  }
  
  const originalSlidesCount = carouselData.length;
  if (originalSlidesCount === 0) {
    const carouselSection = document.getElementById('historias-de-sucesso');
    if(carouselSection) carouselSection.style.display = 'none';
    return;
  }
  
  // Popula o carrossel
  track.innerHTML = carouselData.map(item => `
    <div class="carousel-slide">
      <img src="${item.imgSrc}" alt="${item.caption}">
      <p class="carousel-caption">${item.caption}</p>
    </div>
  `).join('');

  // --- NOVA LÓGICA DE LOOP BIDIRECIONAL ---
  
  const slides = Array.from(track.children);
  const slidesPerView = 3; // Ajuste se mudar no CSS (Desktop)
  
  // Apenas clona se houver mais slides do que o visível
  if (originalSlidesCount > slidesPerView) {
      // 1. Clona os últimos slides e os coloca no início
      const clonesEnd = slides.slice(-slidesPerView).map(slide => slide.cloneNode(true));
      clonesEnd.forEach(clone => track.insertBefore(clone, slides[0]));
      
      // 2. Clona os primeiros slides e os coloca no final
      const clonesStart = slides.slice(0, slidesPerView).map(slide => slide.cloneNode(true));
      clonesStart.forEach(clone => track.appendChild(clone));
  }
  
  let currentIndex = slidesPerView; // Começa no primeiro slide *original*
  let isTransitioning = false;

  // Função para mover o carrossel para a posição correta
  function setPosition(animate = true) {
      if (!animate) {
          track.style.transition = 'none'; // Desliga a animação para o "salto"
      }
      
      const slideWidth = track.children[0].getBoundingClientRect().width;
      track.style.transform = `translateX(-${currentIndex * slideWidth}px)`;

      if (!animate) {
          // Força o navegador a aplicar a mudança antes de reativar a transição
          requestAnimationFrame(() => {
              requestAnimationFrame(() => {
                  track.style.transition = 'transform 0.5s ease-in-out';
              });
          });
      }
  }

  // Pula para a posição inicial sem que o usuário veja
  setPosition(false);

  // O "coração" do loop: ouve o fim da animação
  track.addEventListener('transitionend', () => {
      isTransitioning = false;
      
      // Se chegamos aos clones do final...
      if (currentIndex >= originalSlidesCount + slidesPerView) {
          currentIndex = slidesPerView; // ...volta para o primeiro slide original
          setPosition(false); // ...sem animação
      }
      
      // Se chegamos aos clones do início...
      if (currentIndex < slidesPerView) {
          currentIndex = originalSlidesCount + slidesPerView - 1; // ...pula para o último slide original correspondente
          setPosition(false); // ...sem animação
      }
  });

  function moveNext() {
      if (isTransitioning) return;
      isTransitioning = true;
      currentIndex++;
      setPosition();
  }
  
  function movePrev() {
      if (isTransitioning) return;
      isTransitioning = true;
      currentIndex--;
      setPosition();
  }
  
  // --- FIM DA LÓGICA DE LOOP ---

  nextButton.addEventListener('click', moveNext);
  prevButton.addEventListener('click', movePrev);
  
  let autoPlayInterval;
  function startAutoPlay() {
    // Apenas inicia o autoplay se houver slides para rolar
    if(originalSlidesCount > slidesPerView){
      clearInterval(autoPlayInterval);
      autoPlayInterval = setInterval(moveNext, 5000); 
    }
  }

  function stopAutoPlay() {
    clearInterval(autoPlayInterval);
  }

  container.addEventListener('mouseenter', stopAutoPlay);
  container.addEventListener('mouseleave', startAutoPlay);
  
  function checkButtonsVisibility() {
      if (originalSlidesCount <= slidesPerView) {
          prevButton.style.display = 'none';
          nextButton.style.display = 'none';
          stopAutoPlay();
      } else {
          prevButton.style.display = 'flex';
          nextButton.style.display = 'flex';
          startAutoPlay();
      }
  }
  
  window.addEventListener('resize', () => {
    setPosition(false);
    checkButtonsVisibility();
  });

  checkButtonsVisibility();

  // (Opcional: A lógica de 'fit-contain' pode ser adicionada aqui se você a estiver usando)
  track.querySelectorAll('img').forEach(img => {
      img.onload = () => {
          const aspectRatio = img.naturalWidth / img.naturalHeight;
          if (aspectRatio > 2.0 || aspectRatio < 0.7) {
              img.classList.add('fit-contain');
          }
      };
  });
}
// ===================================================================
// == FIM DO CÓDIGO DO CARROSSEL DE FOTOS (VERSÃO JSON) =============
// ===================================================================