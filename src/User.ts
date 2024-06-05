import {UserState, UserStateDefault} from "./UserState";
import Controller from "./Controller";
import {MenuItem, MenuItemDefault} from "./MenuItem";

class User {
  public id: string;
  public name: string;
  private state: UserState;
  public orderList: MenuItem[];
  public currentOrderItem: MenuItem;

  public constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
    this.state = new UserStateDefault();
    this.orderList = [];
    this.currentOrderItem = new MenuItemDefault();
  }

  public async handleMessage(option: string, controller: Controller) {
    return await this.state.handleMessage(option, controller, this);
  }

  public setState(state: UserState) {
    this.state = state;
  }
}

export default User;
