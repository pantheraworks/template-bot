import {create, Whatsapp} from 'venom-bot';
import Controller from "./Controller";

create({
  session: 'bot'
})
  .then((client: Whatsapp) => start(client))
  .catch((erro) => {
    console.log(erro);
  });

const start = (client: Whatsapp) => {
  const controller = new Controller(client);

  client.onMessage(async (message) => {
    await controller.handleMessage(message);
  }).then(_r => console.log('Listener started!'));
}
