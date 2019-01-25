const express = require('express')
const app = express()

let persons = [
    {
        id: 1,
        name: 'Arto Hellas',
        number: '045-1236543'
    },
    {
        id: 2,
        name: 'Arto Järvinen',
        number: "041-21423123"
    },
    {
        id: 3,
        name: 'Lea Kutvonen',
        number: '040-4323234'
    },
    {
        id: 4,
        name: 'Martti Tienari',
        number: '09-784232'
    }
]

app.get('/persons', (req, res) => {
    res.json(persons)
})

app.get('/info', (req,res) => {
    res.send(`<p>Puhelinluettelossa ${persons.length} henkilön tiedot</p><p>${new Date()}</p>`)
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})