
const form = document.getElementById('formTeste');

form.addEventListener('submit', async (e) => {

  e.preventDefault();

  const nomeCliente =
    document.getElementById('nomeCliente').value;

  const whatsapp =
    document.getElementById('whatsapp').value;

  const tipoTeste =
    document.getElementById('tipoTeste').value;

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

  document.getElementById('resultado').innerHTML = `
    <p>${dados.mensagem}</p>
  `;
});
