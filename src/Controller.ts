import {Message, Whatsapp} from "venom-bot";
import User from "./User";
import MenuItem from "./MenuItem";

class Controller {

  private client: Whatsapp;
  private users: Map<string, User>;
  public readonly menuOptions: Map<string, MenuItem>;

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
    const SDTP = ['Simple', 'Doble', 'Triple', 'Cuadruple'];
    const SD = ['Simple', 'Doble'];
    let options = new Map();
    options.set('1', new MenuItem('1', 'hamburguesa', 9800, SDTP));
    options.set('2', new MenuItem('2', 'hamburguesa con queso', 11000, SDTP));
    options.set('3', new MenuItem('3', 'hamburguesa de pollo', 8500, SD));
    options.set('4', new MenuItem('4', 'hamburguesa de bacon y cheddar', 13000, SDTP));
    options.set('5', new MenuItem('5', 'hamburguesa jr', 5000, SD));
    return options;
  }

  public async sendMenuOptions(user: User) {
    let optionText = 'Seleccioná lo que quieras comer:\n';
    (this.menuOptions).forEach((value: MenuItem, _key) => {
      optionText = optionText.concat(`${value.id}. ${value.name}\n`);
    });
    optionText = optionText.concat('Seleccioná 0 para volver atrás.');
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

  public async sendOrderSizeOptions(user: User) {
    const optionText = this.menuOptions.get(user.currentOrderItem.id)?.sizes.map((option, index) => `${index + 1}. ${option}`).join('\n');
    const text = `Seleccioná el tamaño de tu ${this.menuOptions.get(user.currentOrderItem.id)?.name} :\n${optionText}\nSeleccioná 0 para volver atrás.`;
    return await this.sendText(user.id, text);
  }

  public async sendOrderMedallon(user: User) {
    const options = [
      'Si',
      'No',
    ];
    const optionText = options.map((option, index) => `${index + 1}. ${option}`).join('\n');
    const text = `Pediste: ${user.currentOrderItem.id}.${user.currentOrderItem.name} de tamaño ${user.currentOrderItem.sizes[1]}\nTe gustaria agregar medallones con queso a tu hamburguesa?\nSeleccioná una opcion:\n${optionText}\nSeleccioná 0 para volver atrás.`;
    return await this.sendText(user.id, text);
  }

  public async sendOrderMedallonQuantity(user: User) {
    const options = [
      'Agregar 1 medallon',
      'Agregar 2 medallones',
      'Agregar 3 medallones',
      'Agregar 4 medallones',
      'Agregar 5 medallones',
      'Agregar 6 medallones',
    ];
    const optionText = options.map((option, index) => `${index + 1}. ${option}`).join('\n');
    const text = `Seleccioná la opcion que prefieras:\n${optionText}\nSeleccioná 0 para volver atrás.`;
    return await this.sendText(user.id, text);
  }
}

export default Controller;
