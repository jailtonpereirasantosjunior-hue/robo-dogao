const { Client, LocalAuth } = require('whatsapp-web.js');
const express = require('express');
const app = express();

// Mantém o Render acordado
const port = process.env.PORT || 10000;
app.get('/', (req, res) => res.send('Bot do Dogão da Rosa rodando!'));
app.listen(port, () => console.log(`Servidor web iniciado na porta ${port}`));

// Configuração do Robô adaptada para o Render
const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-gpu'
        ]
    }
});

// 👇👇👇 ATENÇÃO: COLOQUE O NÚMERO DO DOGÃO AQUI 👇👇👇
// Regra: Começa com 55 (Brasil) + Seu DDD + Número
const numeroDogao = '5573998684086'; // <-- APAGUE ESSE NÚMERO E COLOQUE O SEU!

client.on('qr', async (qr) => {
    console.log('\n==================================================');
    console.log('🤖 Solicitando código de acesso ao WhatsApp...');
    try {
        const codigo = await client.requestPairingCode(numeroDogao);
        console.log('👉 SEU CÓDIGO DO WHATSAPP É:', codigo);
        console.log('\nAbra o WhatsApp no celular > Aparelhos Conectados');
        console.log('Toque em "Conectar com número de telefone" e digite o código acima.');
        console.log('==================================================\n');
    } catch (erro) {
        console.log('Erro ao gerar código. Verifique se o número está correto:', erro.message);
    }
});

client.on('ready', () => {
    console.log('\n✅ TUDO PRONTO! O Robô do Dogão está conectado e operando!\n');
});

// Resposta automática de teste
client.on('message', async msg => {
    const mensagem = msg.body.toLowerCase();
    if (mensagem === 'oi' || mensagem === 'boa noite' || mensagem === 'olá') {
        await msg.reply('Olá! Sou o assistente virtual do *Dogão da Rosa* 🌭.\n\nFaça seu pedido pelo nosso cardápio digital acessando o link abaixo:\n🔗 [COLOQUE_SEU_LINK_AQUI]');
    }
});

client.initialize();
