import User from "./User";
import Controller from "./Controller";
import {UserStateMainOptions, UserStateMedallon, UserStateOrderSize} from "./UserState";

abstract class MenuItem {
  public id: string;
  public name: string;
  public readonly price: number;

  protected constructor(id: string, name: string, price: number) {
    this.id = id;
    this.name = name;
    this.price = price;
  }

  abstract updateUserStateAfterSelect(user: User, controller: Controller): Promise<Object | undefined>;

  abstract setSize(size: number, user: User, controller: Controller): Promise<Object | undefined>;

  abstract setMedallones(medallones: number, user: User, controller: Controller): Promise<Object | undefined>;

  getDetail(): string {
    return `${this.name}`;
  }

  getSizes(): string[] {
    return [];
  }
}

class MenuItemDefault extends MenuItem {
  public constructor() {
    super('', '', 0);
  }

  async updateUserStateAfterSelect(_user: User, _controller: Controller): Promise<Object | undefined> {
    return Promise<undefined>
  }

  async setSize(_size: number, _user: User, _controller: Controller): Promise<Object | undefined> {
    return Promise<undefined>
  }

  async setMedallones(_medallones: number, _user: User, _controller: Controller): Promise<Object | undefined> {
    return Promise<undefined>
  }
}

class Burger extends MenuItem {
  public sizes: string[];
  public size: string;
  public medallones: number;

  public constructor(id: string, name: string, price: number, sizes: string[]) {
    super(id, name, price);
    this.sizes = sizes;
    this.size = sizes[0];
    this.medallones = 0;
  }

  getDetail(): string {
    return `${this.name} de tamaño ${this.size}`;
  }

  getSizes(): string[] {
    return this.sizes;
  }

  async updateUserStateAfterSelect(user: User, controller: Controller): Promise<Object | undefined> {
    user.setState(new UserStateOrderSize());
    return await controller.sendOrderSizeOptions(user)
  }

  async setSize(size: number, user: User, controller: Controller): Promise<Object | undefined> {
    if (size > this.sizes.length || size < 0) {
      await controller.sendText(user.id, `Ingresaste un tamaño incorrecto`);
      return await controller.sendOrderSizeOptions(user);
    }
    this.size = this.sizes[size - 1];
    user.currentOrderItem = this;
    user.setState(new UserStateMedallon());
    return await controller.sendOrderMedallon(user);
  }

  async setMedallones(medallones: number, user: User, controller: Controller): Promise<Object | undefined> {
    if (medallones > 6 || medallones < 0) {
      await controller.sendText(user.id, `Ingresaste una cantidad incorrecta`);
      return await controller.sendOrderMedallonQuantity(user);
    }
    this.medallones = medallones;
    user.orderList.push(this);
    user.setState(new UserStateMainOptions());
    await controller.sendText(user.id, `Tu ${this.getDetail()} con ${this.medallones} medallones de queso ya está en el carrito!`);
    return await controller.sendMainOptions(user);
  }
}

export {MenuItem, MenuItemDefault, Burger};
