const dispositivos = [
  {
    id: 'samsung',
    nome: 'Samsung TV',
    imagem: 'imagens/dispositivos/samsung.png',
    iconeFallback: '📺',
    app: 'IB Player Pro'
  },
  {
    id: 'lg',
    nome: 'LG TV',
    imagem: 'imagens/dispositivos/lg.png',
    iconeFallback: '📺',
    app: 'IB Player Pro'
  },
  {
    id: 'androidtv',
    nome: 'Android TV',
    imagem: 'imagens/dispositivos/androidtv.png',
    iconeFallback: '📺',
    app: 'IB Player Pro',
    desc: 'TCL, Philips, Philco, AOC, Sony, Toshiba, Xiaomi...'
  },
  {
    id: 'roku',
    nome: 'Roku TV',
    imagem: 'imagens/dispositivos/roku.png',
    iconeFallback: '🟣',
    app: 'IB Player Pro',
    desc: 'AOC Roku, Philco Roku, TCL Roku e dispositivos Roku'
  },
  {
    id: 'firetv',
    nome: 'Fire TV',
    imagem: 'imagens/dispositivos/firetv.png',
    iconeFallback: '🔥',
    app: 'IB Player Pro'
  },
  {
    id: 'tvbox',
    nome: 'TV Box',
    imagem: 'imagens/dispositivos/tvbox.png',
    iconeFallback: '📦',
    app: 'IB Player Pro'
  },
  {
    id: 'android',
    nome: 'Android',
    imagem: 'imagens/dispositivos/android.png',
    iconeFallback: '📱',
    app: 'IB Player Pro'
  },
  {
    id: 'iphone',
    nome: 'iPhone',
    imagem: 'imagens/dispositivos/iphone.png',
    iconeFallback: '🍎',
    app: 'IB Player Pro'
  }
];

let tutorialAtual = null;
let passoAtual = 0;
let regiaoAtual = 0;
let etapaFormulario = 0;
let intervaloStatus = null;

function esconderTodas() {
  document.querySelectorAll('section').forEach(sec => sec.classList.add('hidden'));
}

function mostrarDispositivos() {
  esconderTodas();
  document.getElementById('telaDispositivos').classList.remove('hidden');
  carregarDispositivos();
}

function carregarDispositivos() {
  const lista = document.getElementById('listaDispositivos');

  lista.innerHTML = dispositivos.map(item => `
    <button class="card-dispositivo" onclick="abrirTutorial('${item.id}')">
      <img
        src="${item.imagem}"
        alt="${item.nome}"
        class="logo-dispositivo"
        onerror="this.style.display='none'; this.nextElementSibling.style.display='block';"
      >

      <div class="icone-fallback" style="display:none;">
        ${item.iconeFallback}
      </div>

      <strong>${item.nome}</strong>

      ${item.desc ? `<span>${item.desc}</span>` : ''}

      <small>${item.app}</small>
    </button>
  `).join('');
}

async function abrirTutorial(id) {
  try {
    const resposta = await fetch(`/api/tutorial/${id}`);
    const dados = await resposta.json();

    if (!dados.success) {
      alert('Tutorial ainda não cadastrado.');
      return;
    }

    tutorialAtual = dados.tutorial;
    passoAtual = 0;

    esconderTodas();
    document.getElementById('telaTutorial').classList.remove('hidden');

    renderizarPasso();

  } catch (error) {
    alert('Erro ao carregar tutorial.');
  }
}

function renderizarPasso() {
  const passos = tutorialAtual.passos;
  const passo = passos[passoAtual];

  document.getElementById('tituloTutorial').innerText =
    `${tutorialAtual.icone || ''} ${tutorialAtual.dispositivo}`;

  document.getElementById('appTutorial').innerText =
    `Aplicativo: ${tutorialAtual.app}`;

  document.getElementById('tituloPasso').innerText =
    `${passo.titulo} (${passoAtual + 1} de ${passos.length})`;

  document.getElementById('textoPasso').innerText = passo.texto || '';

  const img = document.getElementById('imagemPasso');

  if (passo.imagem) {
    img.src = passo.imagem;
    img.classList.remove('hidden');
  } else {
    img.classList.add('hidden');
    img.removeAttribute('src');
  }

  const porcentagem = ((passoAtual + 1) / passos.length) * 100;
  document.getElementById('barraProgresso').style.width = `${porcentagem}%`;

  const btnNaoEncontrei = document.getElementById('btnNaoEncontrei');

  if (passo.mostrarNaoEncontrei) {
    btnNaoEncontrei.classList.remove('hidden');
  } else {
    btnNaoEncontrei.classList.add('hidden');
  }

  const btnProximo = document.getElementById('btnProximo');

  if (passoAtual === passos.length - 1) {
    btnProximo.innerText = '✅ Já instalei';
  } else {
    btnProximo.innerText = 'Próximo →';
  }
}

function proximoPasso() {
  if (passoAtual < tutorialAtual.passos.length - 1) {
    passoAtual++;
    renderizarPasso();
  } else {
    mostrarFormulario();
  }
}

function passoAnterior() {
  if (passoAtual > 0) {
    passoAtual--;
    renderizarPasso();
  }
}

function abrirRegiao() {
  regiaoAtual = 0;
  esconderTodas();
  document.getElementById('telaRegiao').classList.remove('hidden');
  renderizarRegiao();
}

function renderizarRegiao() {
  const passos = tutorialAtual.regiaoPassos || [];
  const img = document.getElementById('imagemRegiao');

  if (!passos.length) {
    document.getElementById('tituloRegiao').innerText = 'Ajuda';
    document.getElementById('textoRegiao').innerText =
      'Caso não encontre o aplicativo, entre em contato com nosso suporte.';

    img.classList.add('hidden');
    document.getElementById('barraRegiao').style.width = '100%';
    return;
  }

  const passo = passos[regiaoAtual];

  document.getElementById('tituloRegiao').innerText =
    `${passo.titulo} (${regiaoAtual + 1} de ${passos.length})`;

  document.getElementById('textoRegiao').innerText = passo.texto || '';

  if (passo.imagem) {
    img.src = passo.imagem;
    img.classList.remove('hidden');
  } else {
    img.classList.add('hidden');
    img.removeAttribute('src');
  }

  const porcentagem = ((regiaoAtual + 1) / passos.length) * 100;
  document.getElementById('barraRegiao').style.width = `${porcentagem}%`;
}

function proximaRegiao() {
  const passos = tutorialAtual.regiaoPassos || [];

  if (regiaoAtual < passos.length - 1) {
    regiaoAtual++;
    renderizarRegiao();
  } else {
    voltarTutorial();
  }
}

function regiaoAnterior() {
  if (regiaoAtual > 0) {
    regiaoAtual--;
    renderizarRegiao();
  }
}

function mostrarFormulario() {
  esconderTodas();

  etapaFormulario = 0;

  document.getElementById('resultado').innerHTML = '';
  document.getElementById('telaFormulario').classList.remove('hidden');

  renderizarEtapaFormulario();
}

function renderizarEtapaFormulario() {
  const etapas = [
    'etapaMac',
    'etapaKey',
    'etapaNome',
    'etapaWhatsapp',
    'etapaTipoTeste',
    'etapaConfirmacao'
  ];

  etapas.forEach(id => {
    document.getElementById(id).classList.add('hidden');
  });

  document.getElementById(etapas[etapaFormulario]).classList.remove('hidden');

  const porcentagem = ((etapaFormulario + 1) / etapas.length) * 100;
  document.getElementById('barraFormulario').style.width = `${porcentagem}%`;

  const btn = document.getElementById('btnAvancarFormulario');

  if (etapaFormulario === etapas.length - 1) {
    btn.innerText = '✅ Confirmar e ativar teste';
    atualizarResumo();
  } else {
    btn.innerText = 'Próximo →';
  }
}

function selecionarTipoTeste(tipo) {
  document.getElementById('tipoTeste').value = tipo;

  const btnSemAdulto = document.getElementById('btnSemAdulto');
  const btnComAdulto = document.getElementById('btnComAdulto');

  btnSemAdulto.classList.remove('ativo');
  btnComAdulto.classList.remove('ativo');

  if (tipo === 'sem_adulto') {
    btnSemAdulto.classList.add('ativo');
  } else {
    btnComAdulto.classList.add('ativo');
  }
}

function avancarEtapaFormulario() {
  const mac = document.getElementById('mac').value.trim();
  const key = document.getElementById('key').value.trim();
  const nomeCliente = document.getElementById('nomeCliente').value.trim();
  const whatsapp = document.getElementById('whatsapp').value.trim();

  if (etapaFormulario === 0 && !mac) {
    alert('Informe o MAC do dispositivo.');
    return;
  }

  if (etapaFormulario === 1 && !key) {
    alert('Informe a KEY do dispositivo.');
    return;
  }

  if (etapaFormulario === 2 && !nomeCliente) {
    alert('Informe seu nome.');
    return;
  }

  if (etapaFormulario === 3 && !whatsapp) {
    alert('Informe seu WhatsApp.');
    return;
  }

  if (etapaFormulario < 5) {
    etapaFormulario++;
    renderizarEtapaFormulario();
  } else {
    enviarTeste();
  }
}

function voltarEtapaFormulario() {
  if (etapaFormulario > 0) {
    etapaFormulario--;
    renderizarEtapaFormulario();
  } else {
    voltarTutorial();
  }
}

function atualizarResumo() {
  const tipo = document.getElementById('tipoTeste').value;

  document.getElementById('resumoMac').innerText =
    document.getElementById('mac').value.trim();

  document.getElementById('resumoKey').innerText =
    document.getElementById('key').value.trim();

  document.getElementById('resumoNome').innerText =
    document.getElementById('nomeCliente').value.trim();

  document.getElementById('resumoWhatsapp').innerText =
    document.getElementById('whatsapp').value.trim();

  document.getElementById('resumoTipoTeste').innerText =
    tipo === 'com_adulto' ? 'Com Adulto 🔞' : 'Sem Adulto';
}

async function enviarTeste() {
  const resultado = document.getElementById('resultado');

  resultado.innerHTML = `
    <p>⏳ Ativando seu teste...</p>
    <p>Não feche esta página.</p>
  `;

  const nomeCliente = document.getElementById('nomeCliente').value.trim();
  const whatsapp = document.getElementById('whatsapp').value.trim();
  const mac = document.getElementById('mac').value.trim();
  const key = document.getElementById('key').value.trim();
  const tipoTeste = document.getElementById('tipoTeste').value;

  try {
    const resposta = await fetch('/api/teste', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        nomeCliente,
        whatsapp,
        mac,
        key,
        tipoTeste
      })
    });

    const dados = await resposta.json();

    if (!dados.success) {
      resultado.innerHTML = dados.mensagem;
      return;
    }

    resultado.innerHTML = `
      <p>${dados.mensagem}</p>
      <p>📡 Iniciando configuração do IB Player...</p>
    `;

    if (dados.jobId) {
      acompanharStatus(dados.jobId);
    }

  } catch {
    resultado.innerHTML = 'Erro ao ativar teste. Tente novamente.';
  }
}

function acompanharStatus(jobId) {
  if (intervaloStatus) {
    clearInterval(intervaloStatus);
  }

  intervaloStatus = setInterval(async () => {
    try {
      const resposta = await fetch(`/api/teste/status/${jobId}`);
      const dados = await resposta.json();

      if (!dados.success) {
        return;
      }

      document.getElementById('resultado').innerHTML = `
        <p>${dados.mensagem}</p>
        <p>Progresso: ${dados.progresso || 0}%</p>
      `;

      if (dados.status === 'finalizado' || dados.status === 'erro') {
        clearInterval(intervaloStatus);
      }

    } catch {
      console.log('Aguardando status...');
    }
  }, 3000);
}

function voltarDispositivos() {
  mostrarDispositivos();
}

function voltarTutorial() {
  esconderTodas();

  document.getElementById('telaTutorial').classList.remove('hidden');

  renderizarPasso();
}
