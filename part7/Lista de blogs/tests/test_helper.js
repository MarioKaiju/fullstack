const Blog = require('../models/blog')

const initialBlogs = [
  {
    title: 'Primer entrada de blog',
    author: 'Mario Alberto Vázquez Anaya',
    url: 'http://localhost:3003/api/blogs/1',
    likes: 4
  },
  {
    title: 'Blog 2',
    author: 'Mario Kaiju',
    url: 'http://localhost:3003/api/blogs/2',
    likes: 0
  }
]

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

module.exports = {
  blogsInDb, initialBlogs, usersInDb
}