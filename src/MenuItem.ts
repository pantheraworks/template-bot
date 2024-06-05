class MenuItem {
  public id: string;
  public name: string;
  public readonly price: number;
  public sizes: string[];

  public constructor(id: string, name: string, price: number, sizes: string[]) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.sizes = sizes;
  }
}

export default MenuItem
