import ManagerMongo from '../../managers/managerMongo.js';

class CartsDaoMongo extends ManagerMongo {

  constructor(model) {
    super(model);
  }

  addCart () {
    let cart = {}
    let date = new Date();
    cart.timestamp = `${date.toLocaleDateString()} - ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
    cart.products = [];

    return this.save(cart);
  }

  addToCart = async (cart, productId) => {
    let currentCart = await this.getById(cart).then(response => response.payload)
    console.log(currentCart);
    currentCart.products.push(productId);
    return this.updateById(cart, currentCart);
  }

  getProducts = async (cart) => {
    let currentCart = await this.getById(cart).then(response => response.payload)
    console.log(currentCart.products);
    return {status: 200, payload: currentCart.products};
  }

  deleteProduct = async (cart, product) => {
    let currentCart = await this.getById(cart).then(response => response.payload)
    let index = currentCart.products.findIndex(p => p.id === product);
    currentCart.products.splice(index, 1);
    return this.updateById(cart, currentCart);
  }

}

export default CartsDaoMongo