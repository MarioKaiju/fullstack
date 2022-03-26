const { ApolloServer, gql, UserInputError, AuthenticationError } = require('apollo-server')
const jwt = require('jsonwebtoken')

const JWT_SECRET = 'esunsecreto'

const mongoose = require('mongoose')
const Book = require('./models/Book')
const Author = require('./models/Author')
const User = require('./models/User')

const MONGODB_URI = 'mongodb+srv://fullstack:Fullstackcourse@cluster0.dybjt.mongodb.net/books-app?retryWrites=true&w=majority'

console.log('connecting to', MONGODB_URI)

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connection to MongoDB:', error.message)
  })

const typeDefs = gql`
  type Book {
    title: String!
    published: Int!
    author: Author!
    genres: [String!]!
    id: ID!
  }

  type Author {
    name: String!,
    born: Int,
    bookCount: Int!
    id: ID!
  }

  type User {
    username: String!
    favoriteGenre: String!
    id: ID!
  }

  type Token {
    value: String!
  }

  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    booksPerAuthor: Int!
    allAuthors: [Author!]!
    me: User
  }

  type Mutation {
    addBook(
      title: String!,
      author: String!,
      published: Int!,
      genres: [String!]!
    ): Book
    editAuthor(
      name: String!,
      setBornTo: Int!
    ): Author
    createUser(
      username: String!
      favoriteGenre: String!
    ): User
    login(
      username: String!
      password: String!
    ): Token
  }
`

const resolvers = {
  Query: {
    bookCount: async () => Book.count({}),
    authorCount: async () => Author.count({}),
    allBooks: async (root, args) => {
      // if (!args.author && !args.genre) {
      //   return books
      // }
      if ( args.genre ) {
        return Book.find( { genres: { $in: [ args.genre ] } } ).populate('author')
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
              }
            }
          },
          {
            $project:
            {
              booksList: 0
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
          book.author = author._id
          await book.save()
          book.author = author
          return book
        }

        const newAuthor = new Author({ name: args.author })
        book.author = newAuthor._id
        await newAuthor.save()
          .catch(error => {
            throw new UserInputError(error.message, {
              invalidArgs: args.author
            })
          })
        await book.save()
          .catch(error => {
            throw new UserInputError(error.message, {
              invalidArgs: args.title
            })
          })
        book.author = newAuthor
        return book
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
            invalidArgs: args
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
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    const auth = req ? req.headers.authorization : null
    if (auth && auth.toLowerCase().startsWith('bearer ')) {
      const decodedToken = jwt.verify(
        auth.substring(7), JWT_SECRET
      )
      const currentUser = await User.findById(decodedToken.id)
      return { currentUser }
    }
  }
})

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`)
})