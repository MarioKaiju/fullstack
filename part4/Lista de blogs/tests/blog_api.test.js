const supertest = require('supertest')
const mongoose = require('mongoose')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')
const { expect } = require('@jest/globals')

beforeEach(async () => {
  await Blog.deleteMany({})

  for(let blog of helper.initialBlogs) {
    let blogObject = new Blog(blog)
    await blogObject.save()
  }
})

//test get all blogs
test('all blogs are returned', async () => {
  const response = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', 'application/json; charset=utf-8')

  expect(response.body).toHaveLength(helper.initialBlogs.length)
})

//test id property name is 'id'
test('identifier property name is id', async () => {
  const response = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', 'application/json; charset=utf-8')

    response.body.map(blog => {
      expect(blog.id).toBeDefined()
    })
})

//test add a new blog
test('a valid blog can be added', async () => {
  const newBlog = {
    title: 'Test blog',
    author: 'Tester',
    url: 'nourl',
    likes: 0
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(200)
    .expect('Content-Type', 'application/json; charset=utf-8')
  
  const blogsAtEnd = await helper.blogsInDb()
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)
  expect(blogsAtEnd[helper.initialBlogs.length].title).toContain(newBlog.title)
})


//test ading a blog without likes parameter
test('a blog without likes is 0', async () => {
  const newBlog = {
    title: 'Test blog',
    author: 'Tester',
    url: 'nourl',
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(200)
    .expect('Content-Type', 'application/json; charset=utf-8')
  
  const blogsAtEnd = await helper.blogsInDb()
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)
  expect(blogsAtEnd[helper.initialBlogs.length].likes).toEqual(0)
})

//test adding a blog without title and url
test('a blog without title or url returns status 400', async () => {
  const newBlog = {
    author: 'Tester',
  }

  const response = await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)
    .expect('Content-Type', 'application/json; charset=utf-8')
})

//test delete a blog
test('delete a blog succeeds with status code 204 if id is valid', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToDelete = blogsAtStart[0]

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .expect(204)

  const blogsAtEnd = await helper.blogsInDb()

  expect(blogsAtEnd).toHaveLength(
    helper.initialBlogs.length - 1
  )

  const titles = blogsAtEnd.map(r => r.title)

  expect(titles).not.toContain(blogToDelete.title)
})

//test update a blog
test('update blog likes', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToUpdate = {...blogsAtStart[0], likes: 15}

  const response = await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .send(blogToUpdate)
    .expect(200)
    .expect('Content-Type', 'application/json; charset=utf-8')

  const updatedBlog = response.body
  expect(updatedBlog.likes).toEqual(blogToUpdate.likes)
})

afterAll(() => {
  mongoose.connection.close()
})