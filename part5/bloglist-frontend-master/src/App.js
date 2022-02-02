import React, { useState, useEffect } from 'react'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'

const Notification = ({ message }) => {
  if ( message === null)
    return null

  if ( message.error )
    return (
      <div className='error'>
        {message.message}
      </div>
    )

  if ( !message.error )
    return (
      <div className='message'>
        {message.message}
      </div>
    )
}

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password,
      })

      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setMessage({ message:'Wrong username or Password', error: true })
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
    console.log('logging with', username, password)
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
  }

  const addBlog = async (blogObject) => {
    const returnedBlog = await blogService.create(blogObject)
    setMessage({ message: `a new blog ${blogObject.title} by ${blogObject.author} added`, error: false })
    setTimeout(() => {
      setMessage(null)
    }, 5000)
    setBlogs(blogs.concat({ ...returnedBlog,
      user: { id: returnedBlog.user, username: user.username, name: user.name } }))
  }

  const removeBlog = async (blogObject) => {
    if (window.confirm(`Remove blog ${blogObject.title} by ${blogObject.author}`)) {
      await blogService.remove(blogObject.id)
      setBlogs(blogs.filter(b => b.id !== blogObject.id))
    }
  }

  const updateBlog = async (blogObject) => {
    await blogService.update( blogObject.id, blogObject)
    setBlogs(blogs.map(blog => blog.id !== blogObject.id ? blog : { ...blog, likes: blog.likes + 1 }))
  }

  blogs.sort(function (a,b) {
    return b.likes - a.likes
  })

  const loginForm = () => {
    return (
      <div>
        <h2>Log in to application</h2>
        <form onSubmit={handleLogin}>
          <div>
            username
            <input
              id='username'
              type="text"
              value={username}
              name="Username"
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
            password
            <input
              id='password'
              type="password"
              value={password}
              name="Password"
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <button id='login-button' type="submit">login</button>
        </form>
      </div>
    )
  }

  const blogForm = () => {
    return (
      <Togglable buttonLabel='create new blog' >
        <BlogForm createBlog={addBlog} />
      </Togglable>
    )
  }

  return (
    <div>
      <Notification message={message} />
      {user === null ?
        loginForm() :
        <div>
          <h2>blogs</h2>
          <p>
            {user.username} is logged in<button onClick={handleLogout}>logout</button>
          </p>
          {blogForm()}
          {blogs.map(blog =>
            <Blog
              key={blog.id}
              blog={blog}
              updateBlog={updateBlog}
              removeBlog={removeBlog}
              user={user}
            />
          )}
        </div>
      }
    </div>
  )
}

export default App