import React, { useState } from 'react'

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const addBlog = (event) => {
    event.preventDefault()
    createBlog({
      title,
      author,
      url,
    })

    setTitle('')
    setUrl('')
    setAuthor('')
  }
  return (
    <div>
      <form onSubmit={addBlog}>
        title:<input id='title'value={title} onChange={(event) => setTitle(event.target.value)} /><br/>
        author:<input id='author' value={author} onChange={(event) => setAuthor(event.target.value)} /><br/>
        url:<input id='url' value={url} onChange={(event) => setUrl(event.target.value)} /><br />
        <button id='create' type='submit'>create</button>
      </form>
    </div>
  )
}

export default BlogForm