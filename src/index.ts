const venom = require('venom-bot');

venom
  .create({
    session: 'bot'
  })
  .then((client) => start(client))
  .catch((erro) => {
    console.log(erro);
  });

const start = (client) => {
  client.onMessage((message) => {
    if (message.body === 'Hi' && message.isGroupMsg === false) {
      client
        .sendText(message.from, 'Welcome Venom 🕷')
        .then((result) => {
          console.log('Result: ', result); //return object success
        })
        .catch((erro) => {
          console.error('Error when sending: ', erro); //return object error
        });
    }
  });
}
