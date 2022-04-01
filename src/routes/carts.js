import express from 'express';
const router = express.Router();

const persistencia = 'fs';
let manager

if (persistencia === 'mongo') {
  import ('../daos/carts/cartsDaoMongo.js').then((cartManager) => {
    manager = new cartManager();
  });
} else if (persistencia === 'fs') {
  import ('../daos/carts/cartsDaoFs.js').then((cartManager) => {
    manager = new cartManager();
  });
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