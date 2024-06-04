class MenuItem {
  public id: number;
  public name: string;
  public price: number;

  public constructor(id: number, name: string, price: number) {
    this.id = id;
    this.name = name;
    this.price = price;
  }
}

export default MenuItem