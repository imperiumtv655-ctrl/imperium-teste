
const express = require('express');
const router = express.Router();

const { gerarTeste } = require('../services/netplay');
const { enviarWhatsapp } = require('../services/evolution');

router.post('/', async (req,res)=>{

    try{

        const { nome, whatsapp, tipoTeste } = req.body;

        const retorno = await gerarTeste(
            nome,
            whatsapp,
            tipoTeste
        );

        const username = retorno.username;
        const password = retorno.password;

        if(!username || !password){

            return res.json({
                success:false,
                mensagem:'Você já realizou o teste.'
            });

        }

        const texto = `
*TESTE GERADO COM SUCESSO*

Usuário: ${username}
Senha: ${password}
`;

        await enviarWhatsapp(
            whatsapp,
            texto
        );

        return res.json({
            success:true,
            mensagem:'Confira seu WhatsApp.'
        });

    }catch(err){

        return res.json({
            success:false,
            mensagem:'Erro ao gerar teste.'
        });

    }

});

module.exports = router;
