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
        await controller.sendText(user.id, 'Opción inválida');
        return await controller.sendMainOptions(user);
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
      await controller.sendText(user.id, 'Ingresaste algo incorrecto, volvé a intentar con uno de los items del menu');
      return await controller.sendMenuOptions(user);
    }
    const menuItem = controller.menuOptions.get(option);
    if (menuItem) {
      user.currentOrderItem = menuItem;
      return await menuItem.updateUserStateAfterSelect(user, controller);
    } else {
      await controller.sendText(user.id, 'Ingresaste algo incorrecto, volvé a intentar con uno de los items del menu');
      return await controller.sendMenuOptions(user);
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
      await controller.sendText(user.id, `Ingresaste un tamaño incorrecto`);
      return await controller.sendOrderSizeOptions(user);
    }
    return user.currentOrderItem.setSize(Number(option), user, controller);
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
        user.orderList.push(user.currentOrderItem);
        user.setState(new UserStateMainOptions());
        await controller.sendText(user.id, `Tu ${user.currentOrderItem.getDetail()} ya está en el carrito!`);
        return await controller.sendMainOptions(user);
      default:
        await controller.sendText(user.id, `Ingresaste una opcion incorrecta`);
        return await controller.sendOrderMedallon(user);
    }
  }
}

class UserStateMedallonQuantity extends UserState {
  constructor() {
    super();
  }

  public handleMessage = async (option: string, controller: Controller, user: User) => {
    if (option == '0') {
      user.setState(new UserStateMedallon());
      return await controller.sendOrderMedallon(user);
    }
    if (!Number(option)) {
      await controller.sendText(user.id, `Ingresaste una cantidad incorrecta`);
      return await controller.sendOrderMedallonQuantity(user);
    }
    return user.currentOrderItem.setMedallones(Number(option), user, controller);
  }
}

export {
  UserState,
  UserStateDefault,
  UserStateMainOptions,
  UserStateOrderOption,
  UserStateOrderSize,
  UserStateMedallon
};
