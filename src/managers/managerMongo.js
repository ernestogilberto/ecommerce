import mongoose from 'mongoose';
import {ProductService} from '../models/product.js';
import fs from 'fs';

const connection = () => {
  mongoose.connect('mongodb+srv://ernesto:123@ecommerce.o7ngl.mongodb.net/ecommerce?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }, (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log('Conectado a MongoDB');
    }
  });
}

const getData = async (model) => {
  try {
    let data = await this.model.find();
    return {status: 200, payload: data}
  } catch (e) {
    return {status: 'error', error: e}
  }
};

class ManagerMongo {
  constructor(model) {
    this.model = model;
    connection();
  }


  save = async (item) => {
    try {
      await this.model.insertMany(item);
      return {status: 200, payload: item}
    } catch (e) {
      return {status: 'error', error: e}
    }
  }

  getById = async (id) => {
    if (!id) return {status: 'error', error: 'id Needed'}
    try {
      let data = await getData(this.path).then(result => result)
      if (data.status === 200) {
        let item = await data.payload.find(item => item.id === id)
        if (item) {
          return {status: 200, payload: item}
        }
        return {status: 404, error: 'item not found'}
      }
      return {status: 404, error: 'Missing File'}
    } catch (e) {
      return {status: 'error', error: e}
    }
  }

  getAll = async () => {
    try {
      let data = await getData(this.path).then(result => result)
      if (data.status === 200) {
        return {status: 200, payload: data.payload}
      }
      return {status: 404, error: 'Missing File'}
    } catch (e) {
      return {status: 'error', error: e}
    }
  }


  deleteById = async (id) => {
    if (!id) return {status: 'error', error: 'id Needed'}
    try {
      let data = await getData(this.path).then(result => result)
      if (data.status === 200) {
        let items = data.payload.filter(item => item.id !== id)
        if (data.payload.length !== items.length) {
          await fs.promises.writeFile(this.path, JSON.stringify(items, null, 2))
          return {status: 200, message: `successfully deleted item with id: ${id}`}
        }
        return {status: 404, message: 'item not found'}
      }
      return {status: 'error', error: 'Missing File'}
    } catch (e) {
      return {status: 'error', error: e}
    }
  }

  deleteAll = async () => {
    try {
      await fs.promises.unlink(this.path)
      return {status: 200, message: 'File deleted successfully'}
    } catch (e) {
      return {status: 'error', error: e}
    }
  }

  updateById = async (id, body) => {
    if (!id) return {status: 'error', error: 'id Needed'}
    try {
      let data = await getData(this.path).then(result => result)
      if (data.status === 200) {
        let items = await data.payload.map(item => item.id === id ? body : item)
        await fs.promises.writeFile(this.path, JSON.stringify(items, null, 2))
        return {status: 200, payload: 'item updated successfully'}
      }
      return {status: 'error', error: 'Missing File'}
    } catch (e) {
      return {status: 'error', error: e}
    }
  }

}

export default ManagerMongo;