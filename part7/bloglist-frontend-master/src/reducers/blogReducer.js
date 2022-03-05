import blogService from '../services/blogs'

const reducer = (state = [], action) => {
  switch (action.type) {
  case 'INIT_BLOGS':
    return action.data
  case 'NEW_BLOG':
    return  [...state, action.data]
  case 'REMOVE_BLOG': {
    const id = action.data;
    return state.filter(b => b.id !== id)
  }
  case 'LIKE_BLOG': {
    return state.map(blog => blog.id !== action.data.id ? blog : {...blog, likes: blog.likes + 1})
  }
  case 'ADD_COMMENT': {
    return state.map(blog => blog.id !== action.data.id ? blog : {...blog, comments: [...blog.comments, action.data.comment]})
  }
  default:
    return state
  }
}

export const initializeBlogs = () => {
  return async dispatch => {
    const blogs = await blogService.getAll()
    dispatch({
      type: 'INIT_BLOGS',
      data: blogs
    })
  }
}

export const createBlog = (data) => {
  return async dispatch => {
    const newBlog = await blogService.create(data)
    dispatch({
      type: 'NEW_BLOG',
      data: newBlog
    })
  }
}

export const removeBlog = (id) => {
  return async dispatch => {
    await blogService.remove(id)
    dispatch({
      type: 'REMOVE_BLOG',
      data: id
    })
  }
}

export const likeBlog = (data) => {
  return async dispatch => {
    dispatch({
      type: 'LIKE_BLOG',
      data
    })
    await blogService.update(data.id, data)
  }
}

export const createComment = (data) => {
  return async dispatch => {
    dispatch({
      type: 'ADD_COMMENT',
      data
    })
    await blogService.createComment(data.id, data.comment)
  }
}

export default reducer;