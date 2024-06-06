import {Message, Whatsapp} from "venom-bot";
import User from "./User";
import {MenuItem, Burger} from "./MenuItem";

function isHamburger(item: MenuItem): item is Burger {
  return item instanceof Burger;
}

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
    options.set('1', new Burger('1', 'hamburguesa', 9800, SDTP));
    options.set('2', new Burger('2', 'hamburguesa con queso', 11000, SDTP));
    options.set('3', new Burger('3', 'hamburguesa de pollo', 8500, SD));
    options.set('4', new Burger('4', 'hamburguesa de bacon y cheddar', 13000, SDTP));
    options.set('5', new Burger('5', 'hamburguesa jr', 5000, SD));
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
    if (isHamburger(user.currentOrderItem)) {
      const menuItem = this.menuOptions.get(user.currentOrderItem.id);
      if (menuItem) {
        if (isHamburger(menuItem)) {
          const optionText = menuItem.sizes.map((option, index) => `${index + 1}. ${option}`).join('\n');
          const text = `Seleccioná el tamaño de tu ${menuItem.name} :\n${optionText}\nSeleccioná 0 para volver atrás.`;
          return await this.sendText(user.id, text);
        }
      }
    }
  }

  public async sendOrderMedallon(user: User) {
    const options = [
      'Si',
      'No',
    ];
    const optionText = options.map((option, index) => `${index + 1}. ${option}`).join('\n');
    const text = `Pediste: ${user.currentOrderItem.getDetail()}\nTe gustaria agregar medallones con queso a tu hamburguesa?\nSeleccioná una opcion:\n${optionText}\nSeleccioná 0 para volver atrás.`;
    return await this.sendText(user.id, text);
  }

  public async sendOrderMedallonQuantity(user: User) {
    const text = '¿Cuántos medallones con queso querés?\nSe pueden agregar hasta 6.\nSeleccioná 0 para volver atrás';
    return await this.sendText(user.id, text);
  }
}

export default Controller;
