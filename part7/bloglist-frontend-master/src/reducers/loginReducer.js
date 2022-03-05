import loginService from '../services/login'
import blogService from '../services/blogs'
import { setNotification } from './notificationReducer';

const reducer = (state = null, action) => {
  switch (action.type) {
  case 'LOGIN':
    return action.data;
  case 'LOGOUT':
    return null
  default:
    return state
  }
}

export const login = (credentials) => {
  return async dispatch => {
    try {
      const user = await loginService.login(credentials)
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      dispatch ({
        type: 'LOGIN',
        data: user
      })
    } catch (exception) {
      dispatch(setNotification({ message:'Wrong username or Password', error: true }, 10))
    }
  }
}

export const loged = (user) => {
  return async dispatch => {
    blogService.setToken(user.token)
    dispatch({
      type: 'LOGIN',
      data: user
    })
  }
}

export const logout = () => {
  window.localStorage.removeItem('loggedBlogappUser')
  return async dispatch => {
    dispatch({
      type: 'LOGOUT'
    })
  }
}
 
export default reducer
