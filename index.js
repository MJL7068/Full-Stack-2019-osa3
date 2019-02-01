require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const cors = require('cors')
const Person = require('./models/person')

const app = express()
app.use(bodyParser.json())
app.use(express.static('build'))

morgan.token('data', (req) => {
    return JSON.stringify(req.body)
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))

app.use(cors())

const errorHandler = (error, req, res, next) => {
    console.log(error.message)

    if (error.name === 'CastError' && error.kinf === 'ObjectId') {
        return res.status(400).send({error: 'malformatted id'})
    }

    next(error)
}

app.use(errorHandler)

const generateId = () => {
    return Math.floor(Math.random() * Math.floor(999999))
}

app.get('/api/persons', (req, res) => {
    Person.find({}).then(persons => {
        res.json(persons.map(person => person.toJSON()))
    })
})

app.get('/info', (req,res) => {
    Person.find({}).then(persons => {
        res.send(`<p>Puhelinluettelossa ${persons.length} henkilön tiedot</p><p>${new Date()}</p>`)
    })
})

app.get('/api/persons/:id', (req, res) => {
    const id = req.params.id
    Person.find({_id: id}).then(person => {
        res.json(person)
    })
    .catch(error => next(error))
})

app.post('/api/persons', (req, res) => {
    const body = req.body

    if (body.name === undefined) {
        return res.status(400).json({
            error: 'name missing'
        })
    }

    if (body.number === undefined) {
        return res.status(400).json({
            error: 'number missing'
        })
    }

    const person = new Person({
        name: body.name,
        number: body.number,
      })
      
      person.save().then(response => {
        mongoose.connection.close();
      })

    res.json(person)
})

app.put('/api/persons/:id', (req, res) => {
    const body = req.body

    const person = {
        name: body.name,
        number: body.number,
    }

    Person.findByIdAndUpdate(req.params.id, person, {new: true})
      .then(updatedPerson => {
          res.json(updatedPerson.toJSON())
      })
      .catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res) => {
    console.log("hello")
    console.log(req.params.id)
    Person.findByIdAndRemove(req.params.id)
      .then(result => {
          response.status(204).end
      })
      .catch(error => next(error))
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})