import { useQuery } from "@apollo/client"
import { useEffect, useState } from "react"
import { ALL_BOOKS } from "../queries"

const Books = ({show}) => {
  const result = useQuery(ALL_BOOKS)
  const [books, setBooks] = useState([])
  const [booksToShow, setBooksToShow] = useState([])
  const [genres, setGenres] = useState([])

  useEffect(() => {
    if (result.data) {
      setBooks(result.data.allBooks)
      setBooksToShow(result.data.allBooks)

      let bookGenres = []
      result.data.allBooks.forEach(book => {
        book.genres.forEach(genre => {
          if (!bookGenres.includes(genre)) {
            bookGenres = bookGenres.concat(genre)
          }
        })
      })
      setGenres(bookGenres)
    }
  }, [result.data]);

  const setGenre = (genre) => {
    setBooksToShow(books.filter(book => book.genres.includes(genre)))
  }

  if (!show) {
    return null
  }

  return (
    <div>
      <h2>books</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {booksToShow.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        {genres.map((g) => (
          <button onClick={() => setGenre(g)}>{g}</button>
        ))}
        <button onClick={() => setBooksToShow(books)}>all genres</button>
      </div>
    </div>
  )
}

export default Books
