import {create, Whatsapp} from 'venom-bot';

create({
  session: 'bot'
})
  .then((client: Whatsapp) => start(client))
  .catch((erro) => {
    console.log(erro);
  });

const start = (client: Whatsapp) => {
  client.onMessage((message) => {
    if (message.body === 'Hi' && !message.isGroupMsg) {
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
