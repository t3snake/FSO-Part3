const express = require('express')
const app = express()

app.use(express.json())

const generateId = () => {
    let newId = Math.ceil(Math.random() * 10000)

    let person = persons.find(person => newId === person.id)

    if (person) {
        return generateId()
    }

    return newId
}

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => id === person.id)

    if (!person){
        response.status(404).end()
    } else {
        response.json(person)
    }
})

app.get('/info', (request, response) => {
    response.send(`
    <p> Phonebook has info for ${persons.length} people </p>
    <p> ${new Date().toString()} </p>
    `)
})

app.post('/api/persons', (request, response) => {
    let personData = request.body

    let newPerson = {
        id: generateId(),
        name: personData.name,
        number: personData.number
    }

    persons = persons.concat(newPerson)

    response.json(newPerson)

})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => id !== person.id)

    response.status(204).end()
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})