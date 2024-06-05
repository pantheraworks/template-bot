class MenuItem {
  public id: string | undefined;
  public name: string;
  public readonly price: number;
  public sizes: string[];
//  private  quantity: number;

  public constructor(id: string, name: string, price: number, sizes: string[]) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.sizes = sizes;
//    this.quantity = 0;
  }

//  setQuantity(quantity: number) {
//    this.quantity = quantity;
//  }
}

export default MenuItem
