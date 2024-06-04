class MenuItem {
  private readonly id: number;
  private readonly name: string;
  private readonly price: number;
  private  quantity: number;

  public constructor(id: number, name: string, price: number) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.quantity = 0;
  }

  getPrice() {
    return this.price;
  }

  getName() {
    return this.name;
  }

  getId() {
    return this.id;
  }

  setQuantity(quantity: number) {
    this.quantity = quantity;
  }
}

export default MenuItem