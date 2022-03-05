const usersRouter = require('express').Router()
const bcrypt = require('bcrypt')
const logger = require('../utils/logger')
const User = require('../models/user')

usersRouter.post('/', async (request, response) => {
  const body = request.body

  if (body.password === undefined) {
    logger.error('error: password missing')
    return response.status(400).json({error: 'password missing'})
  }

  if (body.password.length < 3) {
    logger.error('error: password length is less than required (3)')
    return response.status(400).json({error: 'password length is less than required (3)'})
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(body.password, saltRounds)

  const user = new User({
    username: body.username,
    name: body.name,
    passwordHash
  })

  const savedUser = await user.save()

  response.json(savedUser)
})

usersRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('blogs', { author: 1, title: 1, id: 1, url: 1 })
  response.json(users)
})

usersRouter.get('/:id', async (request, response) => {
  const user = await User.findById(request.params.id).populate('blogs', { author: 1, title: 1, id: 1, url: 1 })
  response.json(user)
})

module.exports = usersRouter