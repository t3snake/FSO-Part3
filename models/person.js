const mongoose = require('mongoose')
require('dotenv').config()

const url = process.env.MONGODB_URI
console.log('connecting to ', url)

mongoose.set('strictQuery', false)

mongoose
  .connect(url)
  .then(result => {
    console.log('MongoDB connected')
  })
  .catch(error => {
    console.log('Connection failed', error.message)
  })

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: [true, 'User name required']
  },
  number: {
    type: String,
    minLength: 8,
    validate: {
      validator: (value) => {
        const subArray = value.split('-')
        if (subArray.length !== 2) return false
        if (subArray[0].length < 2 || subArray[0].length > 3) return false
        return true
      },
      message: 'User phone number invalid'
    },
    required: [true, 'User phone number required']
  }
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)
