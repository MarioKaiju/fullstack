const dummy = (blogs) => {
  return(1)
}

const totalLikes = (blogs) => {
  const reducer =  (sum, item) => {
    return sum + item.likes
  }

  return blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
  const favorite = blogs.find(blog => blog.likes === Math.max(...blogs.map(blog => blog.likes)))
  return ({title: favorite.title, author: favorite.author, likes: favorite.likes})
}

const mostBlogs = (blogs) => {
  const counts = {}
  blogs.forEach(blog => {
    counts[blog.author] = (counts[blog.author] || 0 ) + 1
  });

  const index = Object.values(counts).indexOf(Math.max(...Object.values(counts)))

  return ({author: Object.keys(counts)[index], blogs: Object.values(counts)[index]})
}

const mostLikes = (blogs) => {
  const reducer =  (sum, item) => {
    return sum + item.likes
  }

  const authors = []
  const likes = []
  blogs.map(blog => {
    if (!authors.includes(blog.author))
      authors.push(blog.author)
  });

  for (let i = 0; i < authors.length; i++) {
    likes.push(blogs.filter(({author}) => author === authors[i]).reduce(reducer, 0))
  }
  const index = likes.indexOf(Math.max(...likes))

  return {author: authors[index], likes: likes[index]}
}

module.exports = {
  dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes
}