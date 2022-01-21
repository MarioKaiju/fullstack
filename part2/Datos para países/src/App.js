import { React, useState, useEffect} from 'react';
import axios from 'axios';

const Filter = (props) => {
  const {handleFilterChange, filter} = props
  return (
    <>
      find countries <input onChange={handleFilterChange} value={filter}/>
    </>
  )
}

const Weather = ({country, weather}) => {
  return(
    <>
      <h2>Weather in {country.capital}</h2>
      <h4>temperature: {weather.current.temperature} Celsius</h4>
      <img alt='weather icon' src={weather.current.weather_icons[0]}></img>
      <h4>wind: {weather.current.wind_speed} mph direction {weather.current.wind_dir}</h4>
    </>
  )
}

const Country = ({country, weather, setWeather}) => {
  const api_key = process.env.REACT_APP_API_KEY
  let languages = Object.entries(country.languages)

  useEffect(()=> { 
    console.log('effect')
    axios
    .get(`http://api.weatherstack.com/current?access_key=${api_key}&query=
      ${country.capital}`)
    .then(response => {
      setWeather(response.data)
      console.log('weather ',response.data)
    })
  }, [api_key, country.capital, setWeather])
  
  if (weather !== '')
  return (
    <div>
      <h1>{country.name.common}</h1>
      capital {country.capital}<br />
      population {country.population} <br />
      <h2>languages</h2>
      <ul>
        {languages.map(language => (<li key={language[0]}>{language[1]}</li>))}
      </ul>
      <img alt='country flag' src={country.flags.svg} width={'150px'}></img>
      <Weather country={country} weather={weather}/>
    </div>
    )

  return(null)
}

const Countries = ({countries, filter, setFilter}) => {
  const [weather, setWeather] = useState('')

  const countriestoShow = filter === '' ? countries :
  countries.filter(country => country.name.common.toLowerCase().includes(filter.toLowerCase()))

  const handleShow = (props) => {
    setWeather('')
    setFilter(props)
  }

  if ( countriestoShow.length > 10 )
    return (<div>Too many matches, specify another filter</div>)
  
  else if ( countriestoShow.length > 1 )
    return ( countriestoShow.map(country => (
        <div key={country.name.common}>
          {country.name.common}
          <button onClick={() => handleShow(country.name.common)}>show</button>
        </div>
        )
      )
    )

  else if ( countriestoShow.length === 1) {
    const country = countriestoShow[0]
    return ( 
      <Country country={country} weather={weather} setWeather={setWeather} />
    )
  }

  return (<div>No results</div>)
}

const App = () => {
  const [countries, setCountry] = useState([])
  const [filter, setFilter] = useState('')  

  useEffect(()=> { 
    console.log('effect')
    axios
      .get('https://restcountries.com/v3.1/all')
      .then(response => {
        console.log('promise fulfilled')
        setCountry(response.data)
      })
  }, [])

  console.log('paises',countries.length)

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  return (
    <div>
      <Filter filter={filter} handleFilterChange={handleFilterChange} />
      <Countries countries={countries} filter={filter} setFilter={setFilter} />
    </div>
  )
}

export default App