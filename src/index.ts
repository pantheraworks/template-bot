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

  client.onMessage((message) => {
    controller.sayHiBack(message);
  });
}
