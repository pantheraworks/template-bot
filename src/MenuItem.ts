class MenuItem {
  public id: string;
  public name: string;
  public readonly price: number;
  public sizes: string[];
  public medallones: string;

  public constructor(id: string, name: string, price: number, sizes: string[]) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.sizes = sizes;
    this.medallones = '0';
  }
}

export default MenuItem
