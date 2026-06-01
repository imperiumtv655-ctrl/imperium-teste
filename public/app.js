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
    app: 'NetPlay',
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
    app: 'NetPlay'
  },
  {
    id: 'tvbox',
    nome: 'TV Box',
    imagem: 'imagens/dispositivos/tvbox.png',
    iconeFallback: '📦',
    app: 'NetPlay'
  },
  {
    id: 'android',
    nome: 'Android',
    imagem: 'imagens/dispositivos/android.png',
    iconeFallback: '📱',
    app: 'NetPlay'
  },
  {
    id: 'iphone',
    nome: 'iPhone',
    imagem: 'imagens/dispositivos/iphone.png',
    iconeFallback: '🍎',
    app: 'NetPlay'
  }
];

let tutorialAtual = null;
let passoAtual = 0;
let regiaoAtual = 0;

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
      <div class="icone-fallback" style="display:none;">${item.iconeFallback}</div>
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
  document.getElementById('telaFormulario').classList.remove('hidden');
}

function voltarDispositivos() {
  mostrarDispositivos();
}

function voltarTutorial() {
  esconderTodas();
  document.getElementById('telaTutorial').classList.remove('hidden');
  renderizarPasso();
}

document.getElementById('formTeste').addEventListener('submit', async (e) => {
  e.preventDefault();

  const resultado = document.getElementById('resultado');
  resultado.innerHTML = '⏳ Gerando seu teste...';

  const nomeCliente = document.getElementById('nomeCliente').value;
  const whatsapp = document.getElementById('whatsapp').value;
  const tipoTeste = document.getElementById('tipoTeste').value;

  try {
    const resposta = await fetch('/api/teste', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nomeCliente, whatsapp, tipoTeste })
    });

    const dados = await resposta.json();
    resultado.innerHTML = dados.mensagem;
  } catch {
    resultado.innerHTML = 'Erro ao gerar teste. Tente novamente.';
  }
});
