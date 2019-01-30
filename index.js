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

const generateId = () => {
    return Math.floor(Math.random() * Math.floor(999999))
}

app.get('/api/persons', (req, res) => {
    Person.find({}).then(persons => {
        res.json(persons.map(person => person.toJSON()))
    })
})

app.get('/info', (req,res) => {
    res.send(`<p>Puhelinluettelossa ${persons.length} henkilön tiedot</p><p>${new Date()}</p>`)
})

app.get('/api/persons/:id', (req, res) => {
    const id = req.params.id
    Person.find({_id: id}).then(person => {
        res.json(person)
    })
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(p => p.id !== id)
    res.status(204).end()
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

    /*if (persons.find(p => p.name === body.name)) {
        return res.status(400).json({
            error: 'name must be unique'
        })
    }*/

    /*const person = {
        id: generateId(),
        name: body.name,
        number: body.number,
    }*/

    //persons = persons.concat(person)
    const person = new Person({
        name: body.name,
        number: body.number,
      })
      
      person.save().then(response => {
        mongoose.connection.close();
      })

    res.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})