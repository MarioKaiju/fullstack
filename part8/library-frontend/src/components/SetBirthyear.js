import { useMutation } from "@apollo/client";
import { useState } from "react";
import { ALL_AUTHORS, SET_BIRTHYEAR } from "../queries";
import Select from 'react-select'


const SetBirthyear = ({authors}) => {
  const options = []
  const [ year, setYear ] = useState('')
  const [selectedOption, setSelectedOption] = useState(null);

  const [ setBirthyear ] = useMutation(SET_BIRTHYEAR, {
    refetchQueries: [{ query: ALL_AUTHORS }],
    onError: (error) => {
      console.log(error)
    }
  })

  authors.map(a => options.push({ value: a.name, label: a.name }))

  const submit = async (event) => {
    event.preventDefault()

    setBirthyear({ variables: { name: selectedOption.value, setBornTo: parseInt(year) }})
    setYear('')
  }

  return (
    <div>
      <h2>Set birthyear</h2>
      <form onSubmit={submit}>
        <Select
          defaultValue={selectedOption}
          onChange={setSelectedOption}
          options={options}
        />
        <div>
          born
          <input
            type="number"
            value={year}
            onChange={({ target }) => setYear(target.value)}
          />
        </div>
        <button type="submit">update author</button>
      </form>
    </div>
  )
}

export default SetBirthyear