import {Message, Whatsapp} from "venom-bot";
import User from "./User";
import MenuItem from "./MenuItem";
import menuItem from "./MenuItem";

class Controller {

  private client: Whatsapp;
  private users: Map<string, User>;
  private menuOptions: Map<number, MenuItem>;

  public constructor(client: Whatsapp) {
    this.client = client;
    this.users = new Map();
    this.menuOptions = this.getMenuOptions();
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

  private getMenuOptions() {
    let options = new Map();
    options.set(1, new MenuItem(1, 'hamburguesa', 9800));
    options.set(2, new MenuItem(2, 'hamburguesa con queso', 11000));
    options.set(3, new MenuItem(3, 'hamburguesa de pollo', 8500));
    options.set(4, new MenuItem(4, 'hamburguesa de bacon y cheddar', 13000));
    options.set(5, new MenuItem(5, 'hamburguesa jr', 5000));
    return options;
  }

  public async sendMenuOptions(user: User) {
    let optionText = 'Seleccioná lo que quieras comer:\n';
    (this.menuOptions).forEach((value: menuItem, _key) => {
      optionText = optionText.concat(`${value.getId()}. ${value.getName()}\n`);
    });
    optionText =optionText.concat('Seleccioná 0 para volver atras.');
    return await this.sendText(user.id, optionText);
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

  public getMenu(){
    return this.menuOptions;
  }
}

export default Controller;