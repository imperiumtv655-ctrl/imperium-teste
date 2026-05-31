
const axios = require('axios');

async function enviarWhatsapp(numero,mensagem){

    const url = `${process.env.EVOLUTION_URL}/message/sendText/${process.env.EVOLUTION_INSTANCE}`;

    await axios.post(
        url,
        {
            number: numero,
            text: mensagem
        },
        {
            headers:{
                apikey: process.env.EVOLUTION_APIKEY
            }
        }
    );
}

module.exports = { enviarWhatsapp };
