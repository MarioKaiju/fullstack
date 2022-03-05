import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { createBlog } from '../reducers/blogReducer'

const FormContainer = styled.div`
  font-size: 18px;
  color: #000;
  margin-bottom: 15px;
  @media screen and (max-width: 768px) {
    font-size: 15px;
    margin-bottom: 10px;
  }
  div {
    display: flex;
    align-items: flex-end;
    gap: 20px;
    justify-content:space-between;
    margin-bottom: 15px;
    @media screen and (max-width: 768px) {
      margin-bottom: 10px;
    }
  }
  input {
    appearance: none;
    outline: solid 1px #0055ff;
    border: none;
    font-size: 15px;
    padding: 5px 0.6em;
    border-radius: calc(1em + 2.5px);
    transition: outline, box-shadow .2s;
    :focus {
      outline: solid 1px #0096ff;
      box-shadow:  0 0 0 1px #0096ff33 inset, 0 0 0 2px #0096ff22;
    }
    @media screen and (max-width: 768px) {
      width: 50%;
      font-size: 12px;
    }
  }
`;

const BlogForm = (props) => {
  const addBlog = async (event) => {
    event.preventDefault()
    const title = event.target.title.value
    const author = event.target.author.value
    const url = event.target.url.value
    event.target.title.value = ''
    event.target.author.value = ''
    event.target.url.value = ''
    props.createBlog({title, author, url})
  }

  return (
    <FormContainer>
      <form onSubmit={addBlog}>
        <div>
          <label htmlFor='title' >Title:</label><input id='title' name='title' />
        </div>
        <div>
          <label htmlFor='author' >Author:</label><input id='author' name='author' />
        </div>
        <div>
          <label htmlFor='url' >Url:</label><input id='url' name='url' />
        </div>
        <button id='create' type='submit'>create</button>
      </form>
    </FormContainer>
  )
}

const mapDispatchToProps = dispatch => {
  return {
    createBlog: value => {
      dispatch(createBlog(value))
    }
  }
}

export default connect(
  null,
  mapDispatchToProps
)(BlogForm)