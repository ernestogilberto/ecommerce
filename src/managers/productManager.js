import Manager from './manager.js';


class ProductManager extends Manager {

  constructor(path) {
    super(path);
  }

  addProduct = async (product)  =>{
    if (!product) return {status: 'error', error: 'missing Product'}
    if (!product.name) return {status: 'error', error: 'missing Product name'}
    if (!product.price) return {status: 'error', error: 'missing Product price'}
    if (!product.description) return {status: 'error', error: 'missing Product description'}
    if (!product.thumbnail) return {status: 'error', error: 'missing Product thumbnail'}

    let date = new Date();
    product.timestamp = `${date.toLocaleDateString()} - ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
    product.code = `CE-${Date.now()}`
    return this.save(product);
  }

}

export default ProductManager