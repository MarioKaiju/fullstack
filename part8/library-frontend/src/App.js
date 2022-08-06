import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import LoginForm from './components/LoginForm'
import { useApolloClient, useQuery } from '@apollo/client'

import { useEffect, useState } from 'react'  
import Recommendations from './components/Recommendations'
import { ME } from './queries'

const App = () => {
  const result = useQuery(ME)
  const [page, setPage] = useState('authors')
  const [token, setToken] = useState(null)
  const [user, setUser] = useState(null)
  const client = useApolloClient()

  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
  }

  useEffect(() => {
    if ( localStorage.getItem('library-user-token') ) {
      setToken(localStorage.getItem('library-user-token'))
    }

    if (result.data) {
      setUser(result.data.me)
    }
  }, [result.data])

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        {
          token ? 
          <>
            <button onClick={() => setPage('add')}>add book</button>
            <button onClick={() => setPage('recommend')}>recommend</button>
            <button onClick={logout} >logout</button>
          </>
          :
          <button onClick={() => setPage('login')}>login</button>
        }
      </div>

      <Authors show={page === 'authors'} token={token} />

      <Books show={page === 'books'} />

      <NewBook show={page === 'add'} />

      {
        user ? 
          <Recommendations show={page === 'recommend'} user={user} />
        :
          null
      }

      <LoginForm show={page === 'login'} setToken={setToken} setPage={setPage} />
    </div>
  )
}

export default App
