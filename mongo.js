const mongoose = require('mongoose')

if ( process.argv.length<3 ) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb://fullstack:${password}@ds115625.mlab.com:15625/mldb`

  mongoose.connect(url, { useNewUrlParser: true })

  const personSchema = new mongoose.Schema({
    name: String,
    number: String,
  })
  
  const Person = mongoose.model('Person', personSchema)


  const noteSchema = new mongoose.Schema({
    content: String,
    date: Date,
    important: Boolean,
  })
  
  const Note = mongoose.model('Note', noteSchema)

if (process.argv.length === 3) {
    console.log('puhelinluettelo:')

    Person
      .find({})
      .then(persons => {
        persons.forEach(person => {
          console.log(`${person.name} ${person.number}`)
        })
        mongoose.connection.close()
      })
}

if (process.argv.length === 5) {
      const person = new Person({
        name: process.argv[3],
        number: process.argv[4],
      })
      
      person.save().then(response => {
        console.log(`Lisätään ${process.argv[3]} numero ${process.argv[4]} luetteloon`);
        mongoose.connection.close();
      })
}