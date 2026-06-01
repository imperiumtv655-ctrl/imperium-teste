const express = require('express');
const router = express.Router();

const { gerarTesteNetplay, limparWhatsapp } = require('../services/netplay');
const { enviarWhatsapp } = require('../services/evolution');

router.post('/', async (req, res) => {
  try {
    const { nomeCliente, whatsapp, tipoTeste } = req.body;

    const whatsappLimpo = limparWhatsapp(whatsapp);

    if (!whatsappLimpo) {
      return res.json({
        success: false,
        mensagem: 'Informe seu WhatsApp para gerar o teste.'
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
        'Netplay bloqueou ou retornou erro:',
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

    const texto = `🎉 *TESTE GERADO COM SUCESSO!*

👤 *Usuário:* ${username}
🔑 *Senha:* ${password}

⏳ *Validade:* ${validade}`;

    let enviado = false;

    try {
      enviado = await enviarWhatsapp(whatsappLimpo, texto);
    } catch (erroWhatsapp) {
      console.error(
        'Erro ao enviar WhatsApp:',
        erroWhatsapp.response?.data || erroWhatsapp.message
      );
      enviado = false;
    }

    return res.json({
      success: true,
      mensagem: enviado
        ? '✅ TESTE GERADO COM SUCESSO! Você receberá seu login e senha no WhatsApp.'
        : '✅ TESTE GERADO COM SUCESSO! Caso não receba no WhatsApp, chame o suporte.',
      dados: {
        username,
        password,
        validade
      }
    });

  } catch (error) {
    console.error(
      'Erro inesperado ao gerar teste:',
      error.response?.data || error.message
    );

    return res.json({
      success: false,
      mensagem: 'Erro ao gerar teste. Tente novamente.'
    });
  }
});

module.exports = router;
