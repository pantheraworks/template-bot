import Controller from "./Controller";
import User from "./User";

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
      user.orderItem.id = option;
      user.orderItem.name = menuItem.name;
    } else {
      await controller.sendText(user.id, 'Ingresaste algo incorrecto, volvé a intentar con uno de los items del menu.');
      return await controller.sendMenuOptions(user);
    }
    user.setState(new UserStateOrderSize());
    return await controller.sendOrderSizeOptions(user);
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
    const menuItem = controller.menuOptions.get(user.orderItem.id);
    if (!menuItem || menuItem.sizes.length < Number(option)) {
      await controller.sendText(user.id, `Ingresaste un tamaño incorrecto, tiene que ser uno de los tamaños dados.\n`);
      return await controller.sendOrderSizeOptions(user);
    } else {
      user.orderItem.sizes.push(menuItem.sizes[Number(option) - 1]);
      user.orderList.push(user.orderItem);
      user.setState(new UserStateMainOptions());
      await controller.sendText(user.id, `Acabas de pedir: ${user.orderItem.id}.${user.orderItem.name} de tamaño ${user.orderItem.sizes[1]}\n`);
      return await controller.sendMainOptions(user);
    }
  }
}

export {
  UserState,
  UserStateDefault,
  UserStateMainOptions,
  UserStateOrderOption
};
