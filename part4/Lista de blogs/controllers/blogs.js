const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

//get all blogs
blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

//Post a blog
blogsRouter.post('/', async (request, response) => {
  const body = request.body

  const blog = new Blog({
    author: body.author,
    title: body.title,
    url: body.url,
    likes: body.likes || 0
  })

  const savedBlog = await blog.save()
  response.json(savedBlog)
})

//Delete a blog
blogsRouter.delete('/:id', async (request, response) => {
  await Blog.findByIdAndRemove(request.params.id)
  response.status(204).end()
})

//Update a blog
blogsRouter.put('/:id', async (request, response) => {
  const body = request.body

  const blog = {
    author: body.author,
    title: body.title,
    url: body.url,
    likes: body.likes
  }

  const updatedNote = await Blog.findByIdAndUpdate(request.params.id, blog, {new: true})
  response.json(updatedNote)
})

module.exports = blogsRouter