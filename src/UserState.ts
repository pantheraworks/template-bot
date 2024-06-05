import Controller from "./Controller";
import User from "./User";
import {Hamburger, MenuItem} from "./MenuItem";

function isHamburger(item: MenuItem): item is Hamburger {
  return item instanceof Hamburger;
}

abstract class UserState {
  abstract handleMessage: (option: string, controller: Controller, user: User) => Promise<any>;
}

class UserStateDefault extends UserState {
  constructor() {
    super();
  }

  public handleMessage = async (_option: string, controller: Controller, user: User) => {
    await controller.sayHiBack(user);
    user.setState(new UserStateMainOptions());
    return await controller.sendMainOptions(user);
  }
}

class UserStateMainOptions extends UserState {
  constructor() {
    super();
  }

  public handleMessage = async (option: string, controller: Controller, user: User) => {
    switch (option) {
      case '1':
        await controller.sendMenu(user);
        return await controller.sendMainOptions(user);
      case '2':
        user.setState(new UserStateOrderOption());
        return await controller.sendMenuOptions(user);
      case '3':
        return await controller.sendText(user.id, 'No implementado');
      default:
        return await controller.sendText(user.id, 'Opción inválida');
    }
  }
}

class UserStateOrderOption extends UserState {
  constructor() {
    super();
  }

  public handleMessage = async (option: string, controller: Controller, user: User) => {
    if (option == '0') {
      user.setState(new UserStateMainOptions());
      return await controller.sendMainOptions(user);
    }
    if (!controller.menuOptions.has(option)) {
      await controller.sendText(user.id, 'Ingresaste algo incorrecto, volvé a intentar con uno de los items del menu.');
      return await controller.sendMenuOptions(user);
    }
    const menuItem = controller.menuOptions.get(option);
    if (menuItem) {
      if (isHamburger(menuItem)) {
        user.currentOrderItem = new Hamburger(option, menuItem.name, menuItem.price, []);
        user.setState(new UserStateOrderSize());
        return await controller.sendOrderSizeOptions(user);
      } else {
        await controller.sendText(user.id, 'Ingresaste algo incorrecto, volvé a intentar con uno de los items del menu.');
        return await controller.sendMenuOptions(user);
      }
    }
  }
}

class UserStateOrderSize extends UserState {
  constructor() {
    super();
  }

  public handleMessage = async (option: string, controller: Controller, user: User) => {
    if (option == '0') {
      user.setState(new UserStateOrderOption());
      return await controller.sendMenuOptions(user);
    }
    if (!Number(option)) {
      await controller.sendText(user.id, `Ingresaste un tamaño incorrecto, tiene que ser uno de los tamaños dados.\n`);
      return await controller.sendOrderSizeOptions(user);
    }
    const menuItem = controller.menuOptions.get(user.currentOrderItem.id);
    if (!menuItem || menuItem.getSizes().length < Number(option)) {
      await controller.sendText(user.id, `Ingresaste un tamaño incorrecto, tiene que ser uno de los tamaños dados.\n`);
      return await controller.sendOrderSizeOptions(user);
    } else {
      if (isHamburger(user.currentOrderItem)) {
        user.currentOrderItem.sizes[1] = menuItem.getSizes()[Number(option) - 1]; //posiblemente aca salte error y haya que crear un setSizes()
        user.setState(new UserStateMedallon());
        return await controller.sendOrderMedallon(user);
      }
    }
  }
}

class UserStateMedallon extends UserState {
  constructor() {
    super();
  }

  public handleMessage = async (option: string, controller: Controller, user: User) => {
    switch (option) {
      case '0':
        user.setState(new UserStateOrderSize());
        return await controller.sendOrderSizeOptions(user);
      case '1':
        user.setState(new UserStateMedallonQuantity());
        return await controller.sendOrderMedallonQuantity(user);
      case '2':
        if (isHamburger(user.currentOrderItem)) {
          user.orderList.push(user.currentOrderItem);
          user.setState(new UserStateMainOptions());
          return await controller.sendText(user.id, `Tu ${user.currentOrderItem.sizes[1]} ${user.currentOrderItem.name} ya está en el carrito!.\n`);
        }
        return;
      default:
        return await controller.sendText(user.id, `Ingresaste una opcion incorrecta, tiene que ser una de las opciones dadas.\n`);
    }
  }
}

class UserStateMedallonQuantity extends UserState {
  constructor() {
    super();
  }

  public handleMessage = async (option: string, controller: Controller, user: User) => {
    switch (option) {
      case '0':
        user.setState(new UserStateMedallon());
        return await controller.sendOrderMedallon(user);
      case '1':
      case '2':
      case '3':
      case '4':
      case '5':
      case '6':
        if (isHamburger(user.currentOrderItem)) {
          user.currentOrderItem.medallones = option;
          user.orderList.push(user.currentOrderItem)
          user.setState(new UserStateMainOptions());
          await controller.sendText(user.id, `Tu ${user.currentOrderItem.sizes[1]} ${user.currentOrderItem.name} con ${user.currentOrderItem.medallones} medallones de queso ya está en el carrito!\n`);
          return await controller.sendMainOptions(user);
        }
        return;
      default:
        await controller.sendText(user.id, `Ingresaste una opcion incorrecta, tiene que ser una de las opciones dadas.`);
        return await controller.sendOrderMedallonQuantity(user);
    }
  }
}

export {
  UserState,
  UserStateDefault,
  UserStateMainOptions,
  UserStateOrderOption
};
