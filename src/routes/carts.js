import express from 'express';
import CartsDaoMongo from '../daos/carts/cartsDaoMongo.js';
import CartsDaoFs from '../daos/carts/cartsDaoFs.js';
import {CartsService} from '../models/cart.js';


const router = express.Router();
const persistencia = 'fs';
let manager

if (persistencia === 'mongo') {
  manager = new CartsDaoMongo(CartsService);
} else if (persistencia === 'fs') {
  manager = new CartsDaoFs('src/files/carts.json');
}

let carts = [];

const updateCarts = async () => {
  carts = await manager.getAll().then(r=> (r.payload))
}

updateCarts();

router.post('/', async (req, res) => {
  res.send(await manager.addCart().then(r=> (r.payload)))
  updateCarts();
})

router.delete('/:id', async (req, res) => {
  let index = parseInt(req.params.id);
  carts = carts.filter(product => product.id !== index);
  res.send(await manager.deleteById(index).then(r=> (r.message)))
})

router.post('/:id/:prod', async (req, res) => {
  let index = parseInt(req.params.id);
  let product = parseInt(req.params.prod);
  res.send(await manager.addToCart(index, product).then(r=> (r.payload)))
  updateCarts();
})

router.get('/:id', async (req, res) => {
  let index = parseInt(req.params.id);
  res.send(await manager.getProducts(index).then(r=> (r.payload)))
})

router.delete('/:id/:prod', async (req, res) => {
  let index = parseInt(req.params.id);
  let product = parseInt(req.params.prod);
  res.send(await manager.deleteProduct(index).then(r=> (r.payload)))
})


export default router;