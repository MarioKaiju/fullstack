import React from 'react'
import { connect } from 'react-redux'
import { createComment } from '../reducers/blogReducer'

const CommentForm = (props) => {
  const addComment = async (event) => {
    event.preventDefault()
    const comment = event.target.comment.value
    event.target.comment.value = ''
    props.createComment({id: props.blog, comment})
  }

  return (
    <>
      <form onSubmit={addComment}>
        <input id='comment' name='comment' placeholder='write a comment' />
        <button id='create' type='submit'>add comment</button>
      </form>
    </>
  )
}

const mapDispatchToProps = dispatch => {
  return {
    createComment: value => {
      dispatch(createComment(value))
    }
  }
}

export default connect(
  null,
  mapDispatchToProps
)(CommentForm)