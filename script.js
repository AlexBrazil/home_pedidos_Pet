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

// Fechar modals clicando fora delas
window.onclick = function(event) {
  const fornecedorModal = document.getElementById('fornecedorModal');
  const coordenadorModal = document.getElementById('coordenadorModal');
  
  if (event.target == fornecedorModal) {
    fornecedorModal.style.display = 'none';
  }
  if (event.target == coordenadorModal) {
    coordenadorModal.style.display = 'none';
  }
}

async function submitForm(event) {
  event.preventDefault();
  
  const formData = new FormData(event.target);
  const data = Object.fromEntries(formData);
  
  // Obter referência do botão e texto original antes do try
  const submitButton = event.target.querySelector('button[type="submit"]');
  const originalText = submitButton.textContent;
  
  // Preparar dados para o webhook
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
    // Mostrar indicador de carregamento
    submitButton.textContent = 'Enviando...';
    submitButton.disabled = true;
    
    // Enviar dados para o webhook n8n
    const response = await fetch('https://automatiz-n8n-webhook.dp51xv.easypanel.host/webhook/a5af5896-4ac6-43ce-b1e2-7ffa8a43b55b', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(webhookData)
    });
    
    if (response.ok) {
      // Restaurar botão antes de fechar modal
      submitButton.textContent = originalText;
      submitButton.disabled = false;
      
      // Fechar modal
      closeModal();
      
      // Mostrar mensagem de sucesso
      alert('Cadastro enviado com sucesso! Entraremos em contato em breve.');
      
      // Limpar formulário
      event.target.reset();
    } else {
      throw new Error(`Erro HTTP: ${response.status}`);
    }
    
  } catch (error) {
    console.error('Erro ao enviar cadastro:', error);
    alert('Erro ao enviar cadastro. Tente novamente ou entre em contato conosco.');
    
    // Restaurar botão em caso de erro
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
  
  // Obter referência do botão e texto original antes do try
  const submitButton = event.target.querySelector('button[type="submit"]');
  const originalText = submitButton.textContent;
  
  // Preparar dados para o webhook
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
    // Mostrar indicador de carregamento
    submitButton.textContent = 'Enviando...';
    submitButton.disabled = true;
    
    // Enviar dados para o webhook n8n
    const response = await fetch('https://automatiz-n8n-webhook.dp51xv.easypanel.host/webhook/a5af5896-4ac6-43ce-b1e2-7ffa8a43b55b', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(webhookData)
    });
    
    if (response.ok) {
      // Restaurar botão antes de fechar modal
      submitButton.textContent = originalText;
      submitButton.disabled = false;
      
      // Fechar modal
      closeCoordenadorModal();
      
      // Mostrar mensagem de sucesso
      alert('Cadastro enviado com sucesso! Entraremos em contato em breve.');
      
      // Limpar formulário
      event.target.reset();
    } else {
      throw new Error(`Erro HTTP: ${response.status}`);
    }
    
  } catch (error) {
    console.error('Erro ao enviar cadastro:', error);
    alert('Erro ao enviar cadastro. Tente novamente ou entre em contato conosco.');
    
    // Restaurar botão em caso de erro
    if (submitButton) {
      submitButton.textContent = originalText;
      submitButton.disabled = false;
    }
  }
}