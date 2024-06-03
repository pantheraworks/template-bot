import {Message, Whatsapp} from "venom-bot";
import User from "./User";

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
