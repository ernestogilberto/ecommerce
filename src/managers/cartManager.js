import Manager from './manager.js';
import {response} from 'express';


class CartManager extends Manager {

  constructor(path) {
    super(path);
  }

  addCart () {
    let cart = {}
    let date = new Date();
    cart.timestamp = `${date.toLocaleDateString()} - ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
    cart.products = [];

    return this.save(cart);
  }

  addToCart = async (cart, product) => {
    let currentCart = await this.getById(cart).then(response => response.payload)
    console.log(currentCart);
    currentCart.products.push(product);
    return this.updateById(cart, currentCart);
  }

  getProducts = async (cart) => {
    let currentCart = await this.getById(cart).then(response => response.payload)
    console.log(currentCart.products);
    return {status: 200, payload: currentCart.products};
  }

}

export default CartManager