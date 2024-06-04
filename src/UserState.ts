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
        await controller.sendMenuOptions(user);
        return user.setState(new UserStateOrderOption());
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
    if (!controller.getMenu().has(Number(option))) {
      await controller.sendText(user.id, 'Ingresaste algo incorrecto, volvé a intentar con uno de los items del menu');
      return await controller.sendMenuOptions(user);
    }
    const itemName = (controller.getMenu().get(Number(option))?.getName());
    user.setState(new UserStateOrderQuantity());
    return await controller.sendText(user.id, `¿Cuantas unidades de ${itemName} queres comprar?\nSeleccioná 0 para volver atras`);
  }
}

class UserStateOrderQuantity extends UserState {
  constructor() {
    super();
  }

  public handleMessage = async (option: string, controller: Controller, user: User) => {
    controller.getMenu();
    if (Number(option) == 0) {
      await controller.sendMenuOptions(user);
      return user.setState(new UserStateOrderOption());
    }
    if (!Number(option) || Number(option) < 0) {
      return await controller.sendText(user.id, `Ingresaste una cantidad incorrecta, tiene que ser un numero entero y positivo`);
    }
    return await controller.sendText(user.id, `No implementado`);
  }
}
  export {
  UserState
,
  UserStateDefault
,
  UserStateMainOptions
,
  UserStateOrderOption
};
