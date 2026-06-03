const express = require('express');
const router = express.Router();

const { gerarTesteNetplay, limparWhatsapp } = require('../services/netplay');
const { adicionarPlaylistIb } = require('../services/ib_service');

const {
  limparMac,
  verificarMacJaUsouTeste,
  salvarTesteIb
} = require('../services/mac_service');

const processos = new Map();

function criarJobId() {
  return 'job_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8);
}

function atualizarProcesso(jobId, dados) {
  processos.set(jobId, {
    ...(processos.get(jobId) || {}),
    ...dados,
    atualizadoEm: new Date()
  });
}

router.get('/status/:jobId', (req, res) => {
  const job = processos.get(req.params.jobId);

  if (!job) {
    return res.json({
      success: false,
      status: 'nao_encontrado',
      mensagem: 'Processo não encontrado.'
    });
  }

  return res.json({
    success: true,
    ...job
  });
});

router.post('/', async (req, res) => {
  try {
    const {
      nomeCliente,
      whatsapp,
      mac,
      key,
      tipoTeste
    } = req.body;

    const whatsappLimpo = limparWhatsapp(whatsapp);
    const macLimpo = limparMac(mac);

    if (!whatsappLimpo) {
      return res.json({
        success: false,
        mensagem: 'Informe seu WhatsApp.'
      });
    }

    if (!macLimpo || !key) {
      return res.json({
        success: false,
        mensagem: 'Informe o MAC e a KEY do aplicativo.'
      });
    }

    const macExistente = await verificarMacJaUsouTeste(mac);

    if (macExistente) {
      return res.json({
        success: false,
        mensagem: '⚠️ VOCÊ JÁ REALIZOU O TESTE NESTE APARELHO.'
      });
    }

    let dados = {};

    try {
      const retornoNetplay = await gerarTesteNetplay({
        nomeCliente,
        whatsapp,
        tipoTeste
      });

      dados = retornoNetplay.dados || {};

    } catch (erroNetplay) {
      console.error(
        'Erro Netplay:',
        erroNetplay.response?.data || erroNetplay.message
      );

      return res.json({
        success: false,
        mensagem: 'VOCÊ JÁ REALIZOU O TESTE!'
      });
    }

    const username =
      dados.username ||
      (dados.dados && dados.dados.username);

    const password =
      dados.password ||
      (dados.dados && dados.dados.password);

    const validade =
      dados.expiresAtFormatted ||
      dados.validade ||
      '12 Horas';

    if (!username || !password) {
      return res.json({
        success: false,
        mensagem: 'VOCÊ JÁ REALIZOU O TESTE!'
      });
    }

    await salvarTesteIb({
      nomeCliente,
      whatsapp: whatsappLimpo,
      mac,
      key,
      tipoTeste,
      username,
      password,
      validade,
      status: 'configurando'
    });

    const jobId = criarJobId();

    atualizarProcesso(jobId, {
      status: 'configurando',
      mensagem: '📡 Teste gerado. Configurando seu IB Player, aguarde...',
      progresso: 50,
      mac,
      validade
    });

    console.log('==============================');
    console.log('NOVO TESTE IB GERADO');
    console.log('Job:', jobId);
    console.log('Nome:', nomeCliente);
    console.log('WhatsApp:', whatsappLimpo);
    console.log('MAC:', mac);
    console.log('KEY:', key);
    console.log('USER:', username);
    console.log('PASS:', password);
    console.log('==============================');

    res.json({
      success: true,
      emProcessamento: true,
      jobId,
      mensagem: '✅ Teste gerado com sucesso! Agora estamos configurando seu dispositivo.',
      dados: {
        mac,
        validade
      }
    });

    (async () => {
      try {
        atualizarProcesso(jobId, {
          status: 'configurando',
          mensagem: '📝 Adicionando playlist no IB Player. Mantenha a TV desligada ou o app fechado...',
          progresso: 75
        });

        await adicionarPlaylistIb({
          mac,
          key,
          username,
          password
        });

        atualizarProcesso(jobId, {
          status: 'finalizado',
          mensagem: '✅ Tudo pronto! Seu IB Player foi configurado com sucesso. Agora abra o aplicativo e atualize a lista.',
          progresso: 100
        });

        console.log(`✅ IB Player configurado com sucesso para MAC: ${mac}`);

      } catch (erroIb) {
        console.error(
          'Erro ao configurar IB Player:',
          erroIb.response?.data || erroIb.message
        );

        atualizarProcesso(jobId, {
          status: 'erro',
          mensagem: '⚠️ O teste foi gerado, mas não conseguimos configurar automaticamente o IB Player. Chame o suporte para finalizar.',
          progresso: 100
        });
      }
    })();

  } catch (error) {
    console.error(
      'Erro geral:',
      error.response?.data || error.message
    );

    return res.json({
      success: false,
      mensagem: 'Erro ao ativar teste. Tente novamente.'
    });
  }
});

module.exports = router;
