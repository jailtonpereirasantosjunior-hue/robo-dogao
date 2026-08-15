const { Client, LocalAuth } = require('whatsapp-web.js');
const express = require('express');
const app = express();

// Mantém o Render acordado
const port = process.env.PORT || 10000;
app.get('/', (req, res) => res.send('Bot do Dogão da Rosa rodando!'));
app.listen(port, () => console.log(`Servidor web iniciado na porta ${port}`));

// Configuração do Robô adaptada para o Render (mais leve para não travar)
const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            '--disable-gpu'
        ]
    }
});

// 👇 SEU NÚMERO CONFIGURADO (Sem o 9 extra, conforme o WhatsApp pediu) 👇
const numeroDogao = '557398684086'; 

client.on('qr', async (qr) => {
    console.log('\n==================================================');
    console.log('⏳ WhatsApp carregou! Dando 8 segundos pro servidor respirar...');
    
    // Freio de 8 segundos para evitar o erro de Timeout/Desconexão no Render
    setTimeout(async () => {
        try {
            console.log('🤖 Solicitando código de acesso agora...');
            const codigo = await client.requestPairingCode(numeroDogao);
            console.log('\n👉 SEU CÓDIGO DO WHATSAPP É:', codigo);
            console.log('Abra o WhatsApp > Aparelhos Conectados > Conectar com número');
            console.log('==================================================\n');
        } catch (erro) {
            console.log('\n❌ ERRO DETALHADO:', erro.message);
            console.log('⚠️ DICA: Se o erro falar algo de "Timeout" ou "Too many requests", o WhatsApp te deu um bloqueio temporário por muitas tentativas. Deixe o robô quieto por 15 minutos, e depois clique em "Restart Web Service" no Render.\n');
        }
    }, 8000); // 8000 milissegundos = 8 segundos
});

client.on('ready', () => {
    console.log('\n✅ TUDO PRONTO! O Robô do Dogão está conectado e operando!\n');
});

// Resposta automática de teste
client.on('message', async msg => {
    const mensagem = msg.body.toLowerCase();
    if (mensagem === 'oi' || mensagem === 'boa noite' || mensagem === 'ola' || mensagem === 'olá') {
        await msg.reply('Olá! Sou o assistente virtual do *Dogão da Rosa* 🌭.\n\nFaça seu pedido pelo nosso cardápio digital acessando o link abaixo:\n🔗 [COLOQUE_SEU_LINK_AQUI]');
    }
});

client.initialize();
