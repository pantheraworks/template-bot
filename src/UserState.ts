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
        user.setState(new UserStateOrder());
        return await controller.sendText(user.id, 'Aca deberia mostrar las opciones de menu');
      case '3':
        return await controller.sendText(user.id, 'No implementado');
      default:
        return await controller.sendText(user.id, 'Opción inválida');
    }
  }
}

class UserStateOrder extends UserState {
  constructor() {
    super();
  }

  public handleMessage = async (_option: string, controller: Controller, user: User) => {
    return await controller.sendText(user.id, 'Aca el usuario deberia poder agregar un elemento del menu, por ejemplo cheeseburger');
  }
}

export {UserState, UserStateDefault, UserStateMainOptions, UserStateOrder};
