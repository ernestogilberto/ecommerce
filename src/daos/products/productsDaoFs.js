import ManagerFs from '../../managers/managerFs.js';


class ProductsDaoFs extends ManagerFs {

  constructor(path) {
    super(path);
  }

  addProduct = async (product)  =>{
    if (!product) return {status: 'error', error: 'missing ProductService'}
    if (!product.name) return {status: 'error', error: 'missing ProductService name'}
    if (!product.price) return {status: 'error', error: 'missing ProductService price'}
    if (!product.description) return {status: 'error', error: 'missing ProductService description'}
    if (!product.thumbnail) return {status: 'error', error: 'missing ProductService thumbnail'}

    let date = new Date();
    product.timestamp = `${date.toLocaleDateString()} - ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
    product.code = `CE-${Date.now()}`
    return this.save(product);
  }

}

export default ProductsDaoFs