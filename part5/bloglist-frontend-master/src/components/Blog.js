import React, { useState } from 'react'

const Blog = ({ blog, updateBlog, removeBlog, user }) => {

  const [view, setView] = useState(false)

  const showWhenVisible = { display: view ? '' : 'none' }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const handleLikes = () => {
    updateBlog({ ...blog, likes: blog.likes + 1, user: blog.user.id })
  }

  const handleRemove = () => {
    removeBlog(blog)
  }

  return (
    <div style={blogStyle} className='blogContent'>
      <div>
        {blog.title} {blog.author}
        <button id='view' onClick={() => setView(!view)}>{view ? 'hide' : 'view'}</button>
      </div>
      <div style={showWhenVisible}>
        {blog.url}<br />
        <span>likes {blog.likes}</span><button id='like' onClick={handleLikes} >like</button><br />
        {blog.user.name}<br />
        {user.username === blog.user.username &&
          <button id='remove' onClick={handleRemove}>remove</button>
        }
      </div>
    </div>
  )
}

export default Blog
