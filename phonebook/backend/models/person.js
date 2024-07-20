import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config()

const url = process.env.MONGODB_URI

mongoose.set('strictQuery', false)

console.log('connected to ', url)

mongoose
  .connect(url)
  .then(() => console.log('connected to MongoDB'))
  .catch((err) => console.log('Error connecting to MongoDB:', err.message))

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'User name required'],
    minlength: 3,
  },
  number: {
    type: String,
    minlength: 8,
    validate: {
      validator: (v) => {
        return /^\d{2,3}-\d+$/.test(v)
      },
      message: (props) => `${props.value} is not a valid phone number!`,
    },
  },
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

export const Person = mongoose.model('Person', personSchema)
