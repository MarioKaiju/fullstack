const supertest = require('supertest')
const mongoose = require('mongoose')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const bcrypt = require('bcrypt')
const { expect } = require('@jest/globals')

const User = require('../models/user')

const Blog = require('../models/blog')

beforeEach(async () => {
  await Blog.deleteMany({})

  for(let blog of helper.initialBlogs) {
    let blogObject = new Blog(blog)
    await blogObject.save()
  }

  await User.deleteMany({})

  const initialUser = {
    username: 'Tester',
    name: 'Im the tester',
    password: 'test'
  }

  await api.post('/api/users').send(initialUser)
})

describe('tests for blogs', () => {
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

    const user = await User.findOne({})
    const token = await api
      .post('/api/login')
      .send({username: user.username, password: "test" })

    const bearerToken = 'bearer '.concat(token._body.token)

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', bearerToken)
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
    
    const user = await User.findOne({})
    const token = await api
      .post('/api/login')
      .send({username: user.username, password: "test" })

    const bearerToken = 'bearer '.concat(token._body.token)

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', bearerToken)
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

    const user = await User.findOne({})
    const token = await api
      .post('/api/login')
      .send({username: user.username, password: "test" })

    const bearerToken = 'bearer '.concat(token._body.token)

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', bearerToken)
      .expect(400)
      .expect('Content-Type', 'application/json; charset=utf-8')
  })

  //test add a blog without token
  test('a blog without token is not added', async () => {
    const newBlog = {
      title: 'Test blog',
      author: 'Tester',
      url: 'nourl',
      likes: 0
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)
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
});

describe('tests for users', () => {
  //Before all tests delete all users
  beforeEach(async () => {
    await User.deleteMany({})
  })


  //test adding a user without password
  test('a user without password returns status 400', async () => {
    const newUser = {
      username: 'Tester',
      name: 'Im the tester'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', 'application/json; charset=utf-8')
  })

  //test adding a user without username
  test('a user without username returns status 400', async () => {
    const newUser = {
      name: 'Im the tester',
      password: 'I\'m testing'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', 'application/json; charset=utf-8')
  })

  //test adding a user with password length < 3
  test('a user with password length < 3', async () => {
    const newUser = {
      username: 'Tester',
      name: 'Im the tester',
      password: 'Hi'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', 'application/json; charset=utf-8')
  })

   //test adding a user with username length < 3
   test('a user with username length < 3', async () => {
    const newUser = {
      username: 'Te',
      name: 'Im the tester',
      password: 'password'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', 'application/json; charset=utf-8')
  })
});

afterAll(() => {
  mongoose.connection.close()
})