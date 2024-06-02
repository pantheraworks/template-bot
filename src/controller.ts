import {Message, Whatsapp} from "venom-bot";

class Controller {

  private client: Whatsapp;

  public constructor(client: Whatsapp) {
    this.client = client;
  }

  public async sayHiBack(message: Message) {
    const name = message.sender.name;
    return await this.sendText(message.from, `Hola ${name}! 🕷`);
  }

  public async sendMainOptions(message: Message) {
    const options = [
      'Mostrar menú',
      'Realizar pedido',
      'Consultar pedido'
    ]
    const optionText = options.map((option, index) => `${index + 1}. ${option}`).join('\n');
    const text = `Hola! Seleccioná una opción:\n${optionText}`;
    return await this.sendText(message.from, text);
  }

  public async sendText(to: string, text: string) {
    await this.client.sendText(to, text);
  }
}

export default Controller;
