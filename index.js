const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const express = require('express');

const app = express();
app.use(express.json());

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: { args: ['--no-sandbox', '--disable-setuid-sandbox'] }
});

client.on('qr', (qr) => {
    console.log('👇👇👇 ESCANEIE O QR CODE ABAIXO NO SEU WHATSAPP 👇👇👇');
    qrcode.generate(qr, {small: true});
});

client.on('ready', () => {
    console.log('✅ TUDO PRONTO! O Robô do Dogão está conectado!');
});

// AQUI O ROBÔ RESPONDE QUEM MANDA MENSAGEM
client.on('message', async msg => {
    const texto = msg.body.toLowerCase();
    
    // Saudação inicial
    if (texto === 'oi' || texto === 'olá' || texto === 'ola' || texto === 'boa noite') {
        await msg.reply('Boa noite! Que bom ter você aqui no *Dogão da Rosa* 🌭\n\nFaça seu pedido diretamente pelo nosso link de delivery:\n👉 *https://seusite.com.br/delivery*');
    }
});

client.initialize();

// AQUI É A "PORTA" PARA A SUA HOSTINGER AVISAR O ROBÔ
app.post('/avisar-cliente', async (req, res) => {
    try {
        const numero = req.body.numero; 
        const status = req.body.status; 
        
        // Coloca o 55 do Brasil e formata pro WhatsApp
        const chatId = '55' + numero + '@c.us';
        
        let msgAviso = '';
        if (status === 'cozinha') {
            msgAviso = '👨‍🍳 Oba! O seu Dogão acabou de ir para a chapa. Daqui a pouco tá pronto!';
        } else if (status === 'entrega') {
            msgAviso = '🛵 Vrum vrum! Seu pedido saiu para entrega. Já vai separando o pagamento!';
        }

        if (msgAviso !== '') {
            await client.sendMessage(chatId, msgAviso);
        }

        res.json({ sucesso: true, mensagem: 'Aviso enviado pelo robô!' });
    } catch (erro) {
        res.json({ sucesso: false, erro: erro.message });
    }
});

// Mantém o robô acordado
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
