import mongoose from 'mongoose';

const cartCollection = 'carts';

const cartSchema =  new mongoose.Schema({
  timestamp: {
    type: String,
    required: true,
  },
  products: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
  }],
});

export const CartsService = mongoose.model(cartCollection, cartSchema);