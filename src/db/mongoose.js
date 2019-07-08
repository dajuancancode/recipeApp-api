const mongoose = require('mongoose')

const { MONGODB_URI } = process.env

const options = {
  dbName: 'recipeApp',
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
}

const db = () => {
  return Promise.resolve(
    mongoose.connect(MONGODB_URI, options)
  )
}

db()
  .then(() => console.log("> Mongo connected"))
  .catch(e => console.log("> Mongo error ", e))