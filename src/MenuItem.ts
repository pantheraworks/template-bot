class MenuItem {
  public readonly id: number;
  public readonly name: string;
  public readonly price: number;
  private  quantity: number;

  public constructor(id: number, name: string, price: number) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.quantity = 0;
  }

  setQuantity(quantity: number) {
    this.quantity = quantity;
  }
}

export default MenuItem
