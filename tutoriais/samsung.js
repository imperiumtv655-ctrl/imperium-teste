
const samsungTutorial = {
  id: 'samsung',
  dispositivo: 'Samsung TV',
  icone: '📺',
  app: 'IB Player Pro',

  titulo: 'Tutorial para Samsung TV',

  introducao: `
Antes de gerar seu teste, primeiro precisamos instalar o aplicativo correto na sua TV.

O aplicativo se chama:

✅ IB Player Pro
`,

  passos: [
    'Pegue o controle da sua TV Samsung.',
    'Aperte o botão Início do controle. Normalmente ele tem o desenho de uma casinha 🏠.',
    'Na tela da TV, procure e abra a opção Apps.',
    'Dentro de Apps, vá na lupa de pesquisa 🔍.',
    'Digite exatamente: IB Player Pro.',
    'Quando aparecer o aplicativo, clique em Instalar.',
    'Depois de instalar, abra o aplicativo e deixe ele aberto.'
  ],

  regiaoTitulo: 'Não encontrou o aplicativo?',
  regiaoTexto: `
Isso pode acontecer porque algumas TVs Samsung estão configuradas em uma região onde o aplicativo não aparece.

Nesse caso, será necessário alterar a região da TV.
`,

  regiaoPassos: [
    'Vá em Configurações > Geral > Restaurar.',
    'Digite a senha padrão: 0000.',
    'Quando aparecer a tela de Termos e Condições, pare e não clique em nada.',
    'No controle, pressione: MUDO > VOL+ > CANAL+ > MUDO.',
    'Escolha Estados Unidos ou México.',
    'Finalize a configuração da TV.',
    'Volte na loja Apps e procure novamente por IB Player Pro.'
  ]
};

export default samsungTutorial;
