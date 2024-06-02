import {create, Whatsapp} from 'venom-bot';
import Controller from "./controller";

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
    await controller.sayHiBack(message).then(r => console.log('Said hi back'));
    controller.sendMainOptions(message).then(r => console.log('Sent main options'));
  }).then(r => console.log('Listener started!'));
}
