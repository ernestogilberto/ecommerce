import express from 'express';
import ProductsDaoMongo from '../daos/products/productsDaoMongo.js'
import ProductsDaoFs from '../daos/products/productsDaoFs.js'
import { ProductsService } from '../models/product.js';


const router = express.Router();
const persistencia = 'mongo';
let manager

if (persistencia === 'mongo') {
    manager = new ProductsDaoMongo(ProductsService);
} else if (persistencia === 'fs') {
    manager = new ProductsDaoFs('src/files/products.json');
}

let admin = true;
let products = [];

const initialProducts = async () => {
  let currentProducts = await manager.getAll().then(r => (r.payload))
  currentProducts ? products = currentProducts : products = [];
}

initialProducts();

router.get('/', async (req, res) => {
  res.send(await manager.getAll().then(r => (r.payload)))
})

router.get('/:id', async (req, res) => {
  let index = req.params.id
  if (persistencia === 'fs') index = parseInt(index);
  res.send(await manager.getById(index).then(r => (r.payload)))
})

router.post('/', async (req, res) => {
  let product = req.body;
  product.price = parseFloat(product.price);
  products.push(product)
  !admin ? res.send({error: 'error', message: 'You are not authorized to perform this action'}) :
      res.send(await manager.addProduct(product).then(r => (r.payload || r.error)))
})

router.delete('/:id', async (req, res) => {
  let index = req.params.id;
  if (persistencia === 'fs') index = parseInt(index);
  products = products.filter(product => product.id !== index);
  !admin ? res.send({error: 'error', message: 'You are not authorized to perform this action'}) :
      res.send(await manager.deleteById(index).then(r => (r.message)))
})

router.put('/:id', async (req, res) => {
  let index = req.params.id
  if (persistencia === 'fs') index = parseInt(index);
  let product = req.body;
  product.id = index;
  products = products.map(currentProduct => currentProduct.id === index ? product : currentProduct)
  !admin ? res.send({error: 'error', message: 'You are not authorized to perform this action'}) :
      res.send(await manager.updateById(index, product).then(r => (r.payload)))
})

export default router;