import { useQuery } from "@apollo/client"
import { useEffect, useState } from "react"
import { BOOKS_BY_GENRE } from "../queries"

const Recommendations = ({show, user}) => {
  const [books, setBooks] = useState([])
  const result = useQuery (BOOKS_BY_GENRE,  { variables: { genre: user.favoriteGenre } })

  useEffect(()=> {
    if (result.data) {
      setBooks(result.data.allBooks)
    }
  }, [result.data])

  if (!show) {
    return null
  }

  return (
    <div>
      <h2>recommendations</h2>
      books in your favorite genre <strong>{user.favoriteGenre}</strong>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Recommendations