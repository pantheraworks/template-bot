import {Message, Whatsapp} from "venom-bot";
import User from "./User";
import MenuItem from "./MenuItem";

class Controller {

  private client: Whatsapp;
  private users: Map<string, User>;

  public constructor(client: Whatsapp) {
    this.client = client;
    this.users = new Map();
  }

  public async handleMessage(message: Message) {
    const user = this.users.get(message.from) || new User(message.from, message.sender.pushname || '');
    const response = await user.handleMessage(message.body, this);
    this.users.set(message.from, user);
    return response;
  }

  public async sayHiBack(user: User) {
    const name = user.name;
    return await this.sendText(user.id, `Hola ${name}!`);
  }

  public async sendMainOptions(user: User) {
    const options = [
      'Mostrar menú',
      'Realizar pedido',
      'Consultar pedido'
    ]
    const optionText = options.map((option, index) => `${index + 1}. ${option}`).join('\n');
    const text = `Seleccioná una opción:\n${optionText}`;
    return await this.sendText(user.id, text);
  }

  public async sendMenuOptions(user: User) {
    const options = [
      new MenuItem(1, 'hamburguesa', 9800),
      new MenuItem(2, 'hamburguesa con queso', 11000),
      new MenuItem(3, 'hamburguesa de pollo', 8500),
    ]
    const optionText = options.map((option, _index) => `${option.id}. ${option.name} = ${option.price}`).join('\n');
    const text = `Este es el menu, seleccioná lo que quieras comer:\n${optionText}`;
    return await this.sendText(user.id, text);
  }

  public async sendMenu(user: User): Promise<void> {
    const menuImagesPaths: string[] = [
      './src/assets/menu_1.jpg',
      './src/assets/menu_2.jpg',
      './src/assets/menu_3.jpg',
      './src/assets/menu_4.jpg'
    ];

    try {
      await this.sendText(user.id, 'Este es el menu:');
      for (const path of menuImagesPaths) {
        const index = menuImagesPaths.indexOf(path);
        await this.sendImage(user.id, path, `menu_${index}`, ' ');
      }
    } catch (error) {
      console.log(error);
    }
  }

  public async sendText(to: string, text: string) {
    return await this.client.sendText(to, text);
  }

  private async sendImage(to: string, path: string, image_name: string, caption: string) {
    return await this.client.sendImage(to, path, image_name, caption);
  }
}

export default Controller;
