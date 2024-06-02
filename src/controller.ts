import {Message, Whatsapp} from "venom-bot";

class Controller {

  private client: Whatsapp;

  public constructor(client: Whatsapp) {
    this.client = client;
  }

  public async sayHiBack(message: Message) {
    const name = message.sender.name
    await this.client.sendText(message.from, `Hola ${name}! 🕷`)
  }
}

export default Controller;
