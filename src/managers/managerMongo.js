import mongoose from 'mongoose';
import fs from 'fs';

const getData = async (model, query) => {
  try {
    let data = await model.find();
    return {status: 200, payload: data}
  } catch (e) {
    return {status: 'error', error: e}
  }
};

class ManagerMongo {
  constructor(model) {
    this.model = model;
    this.connection();
  }

  connection = () => {
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
    console.log(typeof id)
    console.log(id);
    try {
      let data = await this.model.findById(id);
      console.log(data);
      if (data) {
        return {status: 200, payload: data}
      }
      return {status: 404, error: 'item not found'}
    } catch (e) {
      return {status: 'error', error: e}
    }
  }

  getAll = async () => {
    try {
      console.log('getAll');
      let data = await getData(this.model).then(result => result)
      if (data.status === 200) {
        console.log('getAll', data.payload);
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
      await this.model.findByIdAndDelete(id);
      return {status: 200, message: `successfully deleted item with id: ${id}`}
    } catch (e) {
      return {status: 'error', error: e}
    }
  }

  deleteAll = async () => {
    try {
      await this.model.deleteMany({});
      return {status: 200, message: 'File deleted successfully'}
    } catch (e) {
      return {status: 'error', error: e}
    }
  }

  updateById = async (id, body) => {
    if (!id) return {status: 'error', error: 'id Needed'}
    try {
      let data = await getData().then(result => result)
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