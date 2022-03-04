import fs from 'fs';

const getData = async (path) => {

  if (!fs.existsSync(path)){
    return {status: 404, error: 'Not Found'};
  }

  try {
    let data = await fs.promises.readFile(path, 'utf8');
    data ? data = JSON.parse(data) : data = [];
    return {status: 200, payload: data}
  } catch (e) {
    return {status: 'error', error: e}
  }
};


const setId = async (path) => {

  try {
    let result = await getData(path).then(result => result)
    if (result.payload.length === 0) {
      return {status: 200, id: 1};
    } else {
      let items = result.payload;
      let id = items[items.length - 1].id
      return {status: 200, id: id + 1};
    }
  } catch (e) {
    return {status: 'error', error: e}
  }
}


class Manager {
  constructor(path) {
    this.path = path;
  }

  save = async (item) => {
    item.id = await setId(this.path).then(result => result.id)

    try {
      if (item.id === 1) {
        await fs.promises.writeFile(this.path, JSON.stringify([item], null, 2))
      } else {
        let items = await getData(this.path).then(result => result.payload)
        items.push(item)
        await fs.promises.writeFile(this.path, JSON.stringify(items, null, 2))
      }
      return {status: 200, payload: item}
    } catch (e) {
      return {status: 'error', error: e}
    }
  }

  getById = async (id) => {
    if(!id) return {status: 'error', error: 'id Needed'}
    try {
      let data = await getData(this.path).then(result => result)
      if(data.status === 200){
        let item = await data.payload.find(item => item.id === id)
        if(item){
          return {status: 200, payload: item}
        }
        return {status: 404, error:'item not found'}
      }
      return{status: 404, error: 'Missing File'}
    } catch (e) {
      return{status: 'error', error: e}
    }
  }

  getAll = async () => {
    try {
      let data = await getData(this.path).then(result => result)
      if(data.status === 200){
        return {status: 200, payload: data.payload}
      }
      return{status: 404, error: 'Missing File'}
    } catch (e) {
      return{status: 'error', error: e}
    }
  }


  deleteById = async (id) => {
    if(!id) return {status: 'error', error: 'id Needed'}
    try {
      let data = await getData(this.path).then(result => result)
      if(data.status === 200){
        let items = data.payload.filter(item => item.id !== id)
        if(data.payload.length !== items.length){
          await fs.promises.writeFile(this.path, JSON.stringify(items, null, 2))
          return {status: 200, message: `successfully deleted item with id: ${id}`}
        }
        return {status: 404, message: 'item not found'}
      }
      return{status: 'error', error: 'Missing File'}
    } catch (e) {
      return{status: 'error', error: e}
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
    if(!id) return {status: 'error', error: 'id Needed'}
    try {
      let data = await getData(this.path).then(result => result)
      if(data.status === 200){
        let items = await data.payload.map(item => item.id === id ? body  : item)
        await fs.promises.writeFile(this.path, JSON.stringify(items, null, 2))
        return {status: 200, payload:'item updated successfully'}
      }
      return{status: 'error', error: 'Missing File'}
    } catch (e) {
      return{status: 'error', error: e}
    }
  }

}

export default Manager;