abstract class MenuItem {
  public id: string;
  public name: string;
  public readonly price: number;

  protected constructor(id: string, name: string, price: number) {
    this.id = id;
    this.name = name;
    this.price = price;
  }
}

class MenuItemDefault extends MenuItem {
  public constructor() {
    super('', '', 0);
  }
}

class Hamburger extends MenuItem {
  public sizes: string[];
  public medallones: string;

  public constructor(id: string, name: string, price: number, sizes: string[]) {
    super(id, name, price);
    this.sizes = sizes;
    this.medallones = '0';
  }
}

export {MenuItem, MenuItemDefault, Hamburger};
