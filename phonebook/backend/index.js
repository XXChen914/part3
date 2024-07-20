import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import { Person } from './models/person.js'

const PORT = process.env.PORT

const app = express()

app.use(express.static('dist'))
app.use(cors())
app.use(express.json())

morgan.token('person', (req) => JSON.stringify(req.body))
app.use(
  morgan(
    ':method :url :status :res[content-length] - :response-time ms :person'
  )
)

const errorHandler = (error, req, res, next) => {
  console.log(error.name, ':', error.message)

  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message }) // bad request
  } else if (error.name === 'MongooseError' && error.code !== 11000) {
    return res.status(503).json({ error: 'Error connecting to MongoDB: ' + error.message })
  }

  next(error)
}

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}

// Get the info of the phonebook
app.get('/info', (req, res, next) => {
  Person.find({}).then((persons) => {
    res.send(
      `<p>Phonebook has info for ${persons.length} peopke</p>
      <p>${new Date()}</p> `
    )
  }).catch(err => {
    next(err)
  })
})

// Get all persons from the phonebook
app.get('/api/persons', (req, res, next) => {
  Person.find({}).then(persons => {
    res.json(persons)
  }).catch(err => {
    next(err)
  })
})

// Get a single person from the phonebook
app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then((person) => {
      if (person) {
        res.json(person)
      } else {
        res.status(404).end()
      }
    })
    .catch((err) => {
      next(err)
    })
})

//Post a new person to the phonebook
app.post('/api/persons', (req, res, next) => {
  const body = req.body

  const newPerson = new Person({
    name: body.name,
    number: body.number,
  })

  newPerson
    .save()
    .then(savedPerson => {
      res.json(savedPerson)
    })
    .catch((err) => next(err))
})

// Update a person in the phonebook
app.put('/api/persons/:id', (req, res, next) => {
  const body = req.body

  const person = {
    name: body.name,
    number: body.number,
  }

  Person.findByIdAndUpdate(req.params.id, person, { runValidators: true, new: true })
    .then((updatedPerson) => {
      res.json(updatedPerson)
    })
    .catch((err) => next(err))
})

// Delete a person from the phonebook
app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then(() => {
      res.status(204).end()
    })
    .catch((err) => next(err))
})

app.use(unknownEndpoint)
app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`Server runing on port ${PORT}`)
})
