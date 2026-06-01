const dispositivos = [
  {
    id: 'samsung',
    nome: 'Samsung TV',
    icone: '📺',
    app: 'IB Player Pro',
    descricao: 'TV Samsung Smart, Tizen, Crystal, QLED'
  },
  {
    id: 'lg',
    nome: 'LG TV',
    icone: '📺',
    app: 'IB Player Pro',
    descricao: 'TV LG Smart, WebOS'
  },
  {
    id: 'roku',
    nome: 'Roku TV',
    icone: '🟣',
    app: 'IB Player Pro',
    descricao: 'Roku TV e aparelhos Roku'
  },
  {
    id: 'androidtv',
    nome: 'Android TV / Google TV',
    icone: '📺',
    app: 'NetPlay',
    descricao: 'TCL, Philips, Philco, AOC, Sony, Xiaomi e outras'
  },
  {
    id: 'tvbox',
    nome: 'TV Box',
    icone: '📦',
    app: 'NetPlay',
    descricao: 'TV Box Android'
  },
  {
    id: 'firetv',
    nome: 'Fire TV Stick',
    icone: '🔥',
    app: 'NetPlay',
    descricao: 'Aparelho Fire TV da Amazon'
  },
  {
    id: 'android',
    nome: 'Celular Android',
    icone: '📱',
    app: 'NetPlay',
    descricao: 'Samsung, Motorola, Xiaomi, Realme e outros'
  },
  {
    id: 'iphone',
    nome: 'iPhone / iPad',
    icone: '🍎',
    app: 'NetPlay',
    descricao: 'Apple iPhone e iPad'
  }
];

let tutorialAtual = null;

function carregarDispositivos() {
  const lista = document.getElementById('listaDispositivos');

  lista.innerHTML = dispositivos.map((item) => `
    <button class="card-dispositivo" onclick="abrirTutorial('${item.id}')">
      <div class="icone">${item.icone}</div>
      <strong>${item.nome}</strong>
      <span>${item.descricao}</span>
      <small>App: ${item.app}</small>
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

    document.getElementById('telaDispositivos').classList.add('hidden');
    document.getElementById('telaRegiao').classList.add('hidden');
    document.getElementById('telaFormulario').classList.add('hidden');
    document.getElementById('telaTutorial').classList.remove('hidden');

    renderizarTutorial();
  } catch (error) {
    alert('Erro ao carregar tutorial.');
  }
}

function renderizarTutorial() {
  const t = tutorialAtual;

  document.getElementById('conteudoTutorial').innerHTML = `
    <h2>${t.icone} ${t.titulo}</h2>

    <div class="app-box">
      <strong>Aplicativo:</strong>
      <span>${t.app}</span>
    </div>

    ${t.modelos ? `
      <div class="modelos-box">
        <strong>Modelos comuns:</strong>
        <p>${t.modelos.join(', ')}</p>
      </div>
    ` : ''}

    <p>${t.introducao}</p>

    <h3>Passo a passo:</h3>

    <ol>
      ${t.passos.map(passo => `<li>${passo}</li>`).join('')}
    </ol>
  `;
}

function mostrarRegiao() {
  const t = tutorialAtual;

  document.getElementById('telaTutorial').classList.add('hidden');
  document.getElementById('telaRegiao').classList.remove('hidden');

  document.getElementById('conteudoRegiao').innerHTML = `
    <h2>🌎 ${t.regiaoTitulo || 'Ajuda para encontrar o aplicativo'}</h2>
    <p>${t.regiaoTexto || 'Siga os passos abaixo para tentar encontrar o aplicativo.'}</p>

    <ol>
      ${(t.regiaoPassos || []).map(passo => `<li>${passo}</li>`).join('')}
    </ol>

    <button class="btn-principal" onclick="voltarTutorial()">
      Voltar e tentar novamente
    </button>
  `;
}

function mostrarFormulario() {
  document.getElementById('telaTutorial').classList.add('hidden');
  document.getElementById('telaFormulario').classList.remove('hidden');
}

function voltarDispositivos() {
  document.getElementById('telaTutorial').classList.add('hidden');
  document.getElementById('telaRegiao').classList.add('hidden');
  document.getElementById('telaFormulario').classList.add('hidden');
  document.getElementById('telaDispositivos').classList.remove('hidden');
}

function voltarTutorial() {
  document.getElementById('telaRegiao').classList.add('hidden');
  document.getElementById('telaFormulario').classList.add('hidden');
  document.getElementById('telaTutorial').classList.remove('hidden');
}

const form = document.getElementById('formTeste');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const resultado = document.getElementById('resultado');

  resultado.innerHTML = `<p>⏳ Gerando seu teste, aguarde...</p>`;

  const nomeCliente = document.getElementById('nomeCliente').value;
  const whatsapp = document.getElementById('whatsapp').value;
  const tipoTeste = document.getElementById('tipoTeste').value;

  try {
    const resposta = await fetch('/api/teste', {
      method: 'POST',
      headers: {
        'Content-Type':'application/json'
      },
      body: JSON.stringify({
        nomeCliente,
        whatsapp,
        tipoTeste
      })
    });

    const dados = await resposta.json();

    resultado.innerHTML = `
      <p>${dados.mensagem}</p>
    `;
  } catch (error) {
    resultado.innerHTML = `
      <p>Erro ao gerar teste. Tente novamente.</p>
    `;
  }
});

carregarDispositivos();
