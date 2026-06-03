const express = require('express');
const router = express.Router();

const { gerarTesteNetplay, limparWhatsapp } = require('../services/netplay');

const {
  limparMac,
  verificarMacJaUsouTeste,
  salvarTesteIb
} = require('../services/mac_service');

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

    const macExistente =
      await verificarMacJaUsouTeste(mac);

    if (macExistente) {
      return res.json({
        success: false,
        mensagem:
          '⚠️ VOCÊ JÁ REALIZOU O TESTE NESTE APARELHO.'
      });
    }

    let dados = {};

    try {

      const retornoNetplay =
        await gerarTesteNetplay({
          nomeCliente,
          whatsapp,
          tipoTeste
        });

      dados = retornoNetplay.dados || {};

    } catch (erroNetplay) {

      console.error(
        'Erro Netplay:',
        erroNetplay.response?.data ||
        erroNetplay.message
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
      status: 'gerado'
    });

    console.log('==============================');
    console.log('NOVO TESTE IB GERADO');
    console.log('Nome:', nomeCliente);
    console.log('WhatsApp:', whatsappLimpo);
    console.log('MAC:', mac);
    console.log('KEY:', key);
    console.log('USER:', username);
    console.log('PASS:', password);
    console.log('==============================');

    return res.json({
      success: true,
      mensagem:
        '✅ Teste gerado com sucesso! Aguarde enquanto configuramos seu dispositivo.',
      dados: {
        mac,
        key,
        validade
      }
    });

  } catch (error) {

    console.error(
      'Erro geral:',
      error.response?.data ||
      error.message
    );

    return res.json({
      success: false,
      mensagem:
        'Erro ao ativar teste. Tente novamente.'
    });
  }
});

module.exports = router;
