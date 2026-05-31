
const axios = require('axios');

async function gerarTeste(nome, telefone, tipoTeste) {

    let url = process.env.NETPLAY_SEM_ADULTO;

    if(tipoTeste === 'adulto'){
        url = process.env.NETPLAY_COM_ADULTO;
    }

    const resposta = await axios.post(url,{
        senderName: nome,
        senderPhone: telefone
    });

    return resposta.data;
}

module.exports = { gerarTeste };
