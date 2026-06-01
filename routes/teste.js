const express = require('express');
const router = express.Router();

const { gerarTesteNetplay, limparWhatsapp } = require('../services/netplay');
const { enviarWhatsapp } = require('../services/evolution');

router.post('/', async (req, res) => {
  try {

    const {
      nomeCliente,
      whatsapp,
      tipoTeste
    } = req.body;

    const whatsappLimpo = limparWhatsapp(whatsapp);

    if (!whatsappLimpo) {
      return res.json({
        success: false,
        mensagem: 'Informe seu WhatsApp para gerar o teste.'
      });
    }

    const { dados } = await gerarTesteNetplay({
      nomeCliente,
      whatsapp,
      tipoTeste
    });

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

      enviado = await enviarWhatsapp(
        whatsappLimpo,
        texto
      );

    } catch (erroWhatsapp) {

      console.error(
        'Erro ao enviar WhatsApp:',
        erroWhatsapp.response?.data ||
        erroWhatsapp.message
      );

      enviado = false;
    }

    return res.json({
      success: true,
      mensagem: enviado
        ? 'TESTE GERADO COM SUCESSO! Confira seu WhatsApp.'
        : 'TESTE GERADO COM SUCESSO! Mas não conseguimos enviar no WhatsApp.',
      dados: {
        username,
        password,
        validade
      }
    });

  } catch (error) {

    console.error(
      'Erro ao gerar teste:',
      error.response?.data ||
      error.message
    );

    return res.json({
      success: false,
      mensagem: 'Erro ao gerar teste. Tente novamente.'
    });
  }
});

module.exports = router;
