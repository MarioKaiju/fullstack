const mongoose = require('mongoose')

if (process.argv.length < 3 ){
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

if (process.argv.length === 4) {
  console.log('Phone number missing')
  process.exit(1)
}

const password = process.argv[2]

console.log(password)

const url =
`mongodb+srv://fullstack:${password}@cluster0.dybjt.mongodb.net/persons-app?retryWrites=true&w=majority`

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: Number,
})

const Person = mongoose.model('Person', personSchema)

const person = new Person({
  name: process.argv[3],
  number: process.argv[4],
})

if (person.name)
  person.save().then(() => {
    console.log(`added ${person.name} number ${person.number} to phonebook`)
    mongoose.connection.close()
  })
else
  Person.find({}).then(result => {
    result.forEach(person => {
      console.log(person)
    })
    mongoose.connection.close()
  })