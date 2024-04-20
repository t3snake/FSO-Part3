const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')
require('dotenv').config()

const app = express()

morgan.token('body', function getResponse (req, res) {
    return JSON.stringify(req.body)
})

app.use(cors())
app.use(express.json())
app.use(express.static('dist'))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.get('/api/persons', (request, response, next) => {
    Person.find({})
    .then(result => {
        response.json(result)
    })
    .catch(error => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
    const id = request.params.id

    Person.findById(id)
    .then(result => {
        if (result) {
            response.json(result)
        } else {
            response.status(404).end()
        }
    })
    .catch(error => next(error))
})

app.get('/info', (request, response) => {
    response.send(`
    <p> Phonebook has info for ${persons.length} people </p>
    <p> ${new Date().toString()} </p>
    `)
})

app.post('/api/persons', (request, response, next) => {
    let personData = request.body

    if (!personData.name) {
        let errorResponse = {
            error: "Name is missing"
        }
        response.status(400).json(errorResponse)
        return
    }

    if (!personData.number) {
        let errorResponse = {
            error: "Number is missing"
        }
        response.status(400).json(errorResponse)
        return
    }

    // const personSearch = persons.find(person => personData.name === person.name)

    // if (personSearch){
    //     let errorResponse = {
    //         error: `${personData.name} already exists in phonebook`
    //     }
    //     response.status(400).json(errorResponse)
    //     return
    // }

    let newPerson = new Person({
        name: personData.name,
        number: personData.number,
    })

    newPerson.save()
    .then(result => {
        response.json(result)
    })
    .catch(error => next(error))

})

app.delete('/api/persons/:id', (request, response, next) => {
    const id = request.params.id
    Person.findByIdAndDelete(id)
    .then(result => {
        response.status(204).end()
    })
    .catch(error => next(error))
})

const errorHandler = (error, request, response, next) => {
    console.error(error.message)
  
    if (error.name === 'CastError') {
      return response.status(400).send({ error: 'malformatted id' })
    } 
  
    next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})