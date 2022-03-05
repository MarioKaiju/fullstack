const reducer = (state = null, action) => {
  switch(action.type) {
    case 'SET_NOTIFICATION':
      return action.data
    case 'CLEAR_NOTIFICATION':
      return null
    default:
      return state
  }
}

let timeout

export const setNotification = (data, time) => {
  return async dispatch => {
    dispatch({
      type: 'SET_NOTIFICATION',
      data
    })
    clearTimeout(timeout)

    timeout = setTimeout(() => {
      dispatch(clearNotification())
    }, time*1000);
  }
}

export const clearNotification = () => {
  return {
    type: 'CLEAR_NOTIFICATION'
  }
}

export default reducer