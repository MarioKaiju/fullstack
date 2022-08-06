const { UserInputError, AuthenticationError } = require('apollo-server')
const jwt = require('jsonwebtoken')
const Book = require('./models/Book')
const Author = require('./models/Author')
const User = require('./models/User')
const { PubSub } = require('graphql-subscriptions')
const pubsub = new PubSub()

const JWT_SECRET = 'esunsecreto'

const assignAuthor = async (book, author) => {
  book.author = author._id
  await book.save()
  .catch(error => {
    throw new UserInputError(error.message, {
      invalidArgs: true
    })
  })

  book.author = author
  pubsub.publish('BOOK_ADDED', { bookAdded: book } )
  return book
}

const resolvers = {
  Query: {
    bookCount: async () => Book.collection.countDocuments(),
    authorCount: async () => Author.collection.countDocuments(),
    allBooks: async (root, args) => {
      // if (!args.author && !args.genre) {
      //   return books
      // }
      if ( args.genre ) {
        return Book.find( { genres: { $in: [ args.genre ] } } ).populate('author')
      }
      if( args.author ) {
        return Book.aggregate(
          [
            {
              $lookup: {
                from: 'authors',
                localField: 'author',
                foreignField: '_id',
                as: 'bookAuthor'
              }
            },
            {
              $match: {
                "bookAuthor.name": args.author
              }
            },
            {
              $set: {
                author: { $arrayElemAt: ["$bookAuthor", 0] },
                id: "$_id"
              }
            },
            {
              $addFields: {
                "author.id" : "$author._id"
              }
            },
            {
              $project: {
                _id: 0,
                bookAuthor: 0,
                "author._id": 0,
                __v: 0
              }
            }
          ]
        )
      }
      if( args.author && args.genre ) {
        return Book.aggregate(
          [
            {
              $lookup: {
                from: 'authors',
                localField: 'author',
                foreignField: '_id',
                as: 'bookAuthor'
              }
            },
            {
              $match: {
                "bookAuthor.name": args.author,
                genres: {  $in: [ args.genre ] }
              }
            },
            {
              $set: {
                author: { $arrayElemAt: ["$bookAuthor", 0] },
                id: "$_id"
              }
            },
            {
              $addFields: {
                "author.id" : "$author._id"
              }
            },
            {
              $project: {
                _id: 0,
                bookAuthor: 0,
                "author._id": 0,
                __v: 0
              }
            }
          ]
        )
      }
      return Book.find({}).populate('author')
      // if (args.genre) {
      //   const byGenre = books.filter(book => book.genres.includes(args.genre))
      //   if (args.author) {
      //     return byGenre.filter(book => book.author === args.author)
      //   }
      //   return byGenre
      // }
      // return books.filter(book => book.author === args.author)
    },
    allAuthors: async () => {
        return Author.aggregate(
        [
          {
            $lookup: {
              from: 'books',
              localField: '_id',
              foreignField: 'author',
              as: 'booksList'
            }
          },
          {
            $addFields: {
              bookCount: {
                $size: "$booksList"
              },
              id: '$_id'
            }
          },
          {
            $project:
            {
              booksList: 0,
              _id: 0,
            }
          }
        ]
      )
    },
    me: (root, args, { currentUser }) => {
      return currentUser
    }
  },
  Mutation: {
    addBook: async (root, args, { currentUser }) => {
      if ( !currentUser ) {
        throw new AuthenticationError("not authenticated")
      }

      const book = new Book({ ...args })

      const author = await Author.findOne({ name: args.author })
      try {
        if ( author ) {
          return await assignAuthor(book, author)
          // book.author = author._id
          // await book.save()
          // book.author = author
          // pubsub.publish('BOOK_ADDED', { bookAdded: book } )
          // return book
        }

        const newAuthor = new Author({ name: args.author })
        
        await newAuthor.save()
        .catch(error => {
          throw new UserInputError(error.message, {
            invalidArgs: true
          })
        })
        
        return await assignAuthor(book, newAuthor);
        // book.author = newAuthor._id
        // await book.save()
        //   .catch(error => {
        //     throw new UserInputError(error.message, {
        //       invalidArgs: args.title
        //     })
        //   })
        // book.author = newAuthor

        // pubsub.publish('BOOK_ADDED', { bookAdded: book } )

        // return book
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: true
        })
      }
    },
    editAuthor: async (root, args, { currentUser }) => {
      if ( !currentUser ) {
        throw new AuthenticationError("not authenticated")
      }

      const authorToEdit = await Author.findOne({ name: args.name })

      if (authorToEdit) {
        authorToEdit.born = args.setBornTo
        await authorToEdit.save()
        return authorToEdit
      }
      return null
    },
    createUser: (root, args) => {
      const user = new User({ ...args })

      return user.save()
        .catch(error => {
          throw new UserInputError(error.message, {
            invalidArgs: true
          })
        })
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })

      if ( !user || args.password !== 'secreto' ) {
        throw new UserInputError("wrong credentials")
      }

      const userForToken = {
        username: user.username,
        id: user._id
      }

      return { value: jwt.sign(userForToken, JWT_SECRET) }
    }
  },
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator(['BOOK_ADDED'])
    }
  }
}

module.exports = resolvers