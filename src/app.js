import express from 'express';
import productsRouter from './routes/products.js';
import cartsRouter from './routes/carts.js';

const app = express();

const PORT = 8080;

const server = app.listen(PORT, ()=>{console.log(`Listening on port ${PORT}`)})

app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use(express.static('public'))
app.use('/api/productos', productsRouter)
app.use('/api/carrito', cartsRouter)