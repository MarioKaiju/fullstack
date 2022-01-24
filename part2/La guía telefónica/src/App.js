import { React, useState, useEffect} from 'react';
import personService from './services/persons'
import Person from './components/Person';

const Filter = (props) => {
  const {handleFilterChange, filter} = props
  return (
    <>
      filter shown with <input onChange={handleFilterChange} value={filter}/>
    </>
  )
}

const Notification = ({message}) => {
  if ( message === null)
    return null

  if ( message.error )
    return (
      <div className='error'>
        {message.message}
      </div>
    )
  
  if ( !message.error)
    return ( 
      <div className='message'>
        {message.message}
      </div>
    )
}

const Persons = ({persons, filter, setPersons, setErrorMessage}) => {
  const personsToShow = filter === '' ? persons : persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()))

  const deletePerson = (id) => {
    const person = persons.find(p => p.id === id )

    if ( window.confirm(`Delete ${person.name} ?`)) {
      personService
        .del(id)
        .then( setPersons(persons.filter(p => p.id !== id)))
        .catch(error => {
          setErrorMessage({message:
            `Information of '${person.name}' has already been removed from server`,
            error: true})
            setTimeout(() => {
              setErrorMessage(null)
            }, 5000);
            setPersons(persons.filter(p=> p.id !== id))
        })
    }
  }

  return ( personsToShow.map(person => (
        <Person key={person.id}
          person={person}
          deletePerson={() => deletePerson(person.id)} />
      )
    )
  )
}

const PersonForm  = (props) => {
  const {persons, setPersons, setErrorMessage} = props
  const [ newPerson, setNewPerson ] = useState ({name: '', number:''})

  const addPerson = (event) => {
    event.preventDefault()
    let personObject = {
      name: newPerson.name,
      number: newPerson.number
    }

    if ( persons.find(({name}) => name === newPerson.name)) {
      const p = persons.find(p => p.name === newPerson.name)
      if ( window.confirm(
        `${newPerson.name} is already added to phonebook, replace the old number with a new one?`) )
        personService
          .update(p.id, newPerson)
          .then(returnedPerson => {
            setPersons(persons.map(person => person.id !== p.id ? person : returnedPerson))
            setErrorMessage({message: `Updated ${returnedPerson.name}`, error: false })
            setTimeout(() => {
              setErrorMessage(null)
            }, 5000);
          })
          .catch(error => {
            setErrorMessage({message: error.response.data.error, error: true})
            setTimeout(() => {
              setErrorMessage(null)
            }, 5000);
          })
      return
    }
    if ( persons.find(({number}) => number === newPerson.number)) {
      window.alert(`${newPerson.number} is already added to phonebook`)
      personObject = {name:'', number: ''}
    }

    if ( personObject.number !== '' && personObject.name !== '' ) {
      personService
        .create(personObject)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          setNewPerson({name: '', number:''})
          setErrorMessage({message: `Added ${returnedPerson.name}`, error: false})
          setTimeout(() => {
            setErrorMessage(null)
          }, 5000);
        }).catch(error => {
          setErrorMessage({message: error.response.data.error, error: true})
          setTimeout(() => {
            setErrorMessage(null)
          }, 5000);
        })
    }
  }
  
  const handlePersonChange = (event) => {
    const target = event.target
    const personObject = {
      name: target.name === 'name' ? target.value : newPerson.name,
      number: target.name === 'name' ? newPerson.number : target.value
    }
    setNewPerson(personObject)
  }

  return (
    <form onSubmit={addPerson}>
      <div>
        name: <input name='name' onChange={handlePersonChange} value={newPerson.name}/>
      </div>
      <div>
        number: <input name='phone' onChange={handlePersonChange} value={newPerson.number}/>
      </div>
      <div>
        <button type='submit' >add</button>
      </div>
    </form>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [errorMessage, setErrorMessage] = 
  useState({message:'some error happened...', error: true})

  useEffect(()=> {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  const [filter, setFilter] = useState('')  

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={errorMessage}/>
      <Filter filter={filter} handleFilterChange={handleFilterChange} />
      <h2>add a new</h2>
      <PersonForm
        persons={persons}
        setPersons={setPersons}
        setErrorMessage={setErrorMessage} />
      <h2>Numbers</h2>
      <Persons persons={persons} 
        filter={filter}
        setPersons={setPersons}
        setErrorMessage={setErrorMessage} />
    </div>
  )
}

export default App