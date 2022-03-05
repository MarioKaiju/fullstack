import React, { useState } from 'react'
import { connect } from 'react-redux'
import { useParams } from 'react-router-dom'
import styled from 'styled-components'
import { likeBlog, removeBlog } from '../reducers/blogReducer'
import CommentForm from './CommentForm'

const MainContainer = styled.div`
  max-width: 950px;
  margin: 0 auto 50px;
  display: flex;
  flex-direction: column;
  gap: 25px;
`;

const BlogContainer = styled.div`
  border: 2px solid #0055ff;
  border-radius: 25px;
  padding: 25px;
  @media screen and (max-width: 768px) {
    padding: 15px;
    border-radius: 15px;
  }
  h2 {
    font-size: 20px;
    margin-block-end: unset;
    margin-block-start: unset;
    margin-bottom: 20px;
    border-bottom: #c4c4c4 solid 1px;
    padding-bottom: 5px;
    @media screen and (max-width: 768px) {
      margin-bottom: 10px;
      font-size: 15px;
    }
  }
  a {
    text-decoration: none;
    color: #0055ff;
    outline: solid 1px #0055ff;
    padding: 0.1em 0.75em;
    font-size: 15px;
    @media (hover: hover) and (pointer: fine) {
      :hover {
        color: #0096ff;
        outline: solid 1px #0096ff;
      }
    }
    @media screen and (max-width: 768px) {
      font-size: 12px;
    }
  }
`;

const InfoContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
  margin-top: 20px;
  @media screen and (max-width: 768px) {
    gap: 10px;
    margin-top: 10px;
  }
  p {
    color: #444;
    font-size: 18px;
    margin-block-end: unset;
    margin-block-start: unset;
    @media screen and (max-width: 768px) {
      font-size: 12px;
    }
  }
  div {
    display: flex;
    gap: 10px;
    align-items: center;
  }
  div p:first-of-type {
    color: #0096ff;
  }
  button {
    border: 2px solid #0055ff;
    padding: 0.25em 0.5em;
    border-radius: 25px;
    background-color: transparent;
    font-size: 15px;
    color: #0055ff;
    @media (hover: hover) and (pointer: fine) {
      :hover {
        cursor: pointer;
        border: 2px solid #0096ff;
        color: #0096ff;
      }
    }
    @media screen and (max-width: 768px) {
      font-size: 12px;
    }
  }
`;

const CommentsContainer = styled.div`
  border: 2px solid #0055ff;
  border-radius: 25px;
  max-width: 600px;
  padding: 25px;
  @media screen and (max-width: 768px) {
    padding: 15px;
    border-radius: 15px;
  }
  h3 {
    font-size: 20px;
    border-bottom: #c4c4c4 solid 1px;
    padding-bottom: 5px;
    margin-block-start: unset;
    margin-block-end: unset;
    margin-bottom: 20px;
    @media screen and (max-width: 768px ){
      margin-bottom: 10px;
      font-size: 15px;
    }
  }
  form {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    input {
      width: 190px;
      font-size: 15px;
      outline: solid 1px #000;
      border-radius: calc(1em + 2.5px);
      padding: 2.5px .6em;
      border: none;
      transition: outline, box-shadow .2s;
      @media screen and (max-width: 768px ){
        font-size: 12px;
        border-radius: calc(1em + 1px);
        padding: 1px .6em;
      }
      :focus {
        outline: solid 1px #777;
        box-shadow:  0 0 0 1px #7773 inset, 0 0 0 2px #7773;
      }
    }
    button {
      font-size: 15px;
      color: #0055ff;
      background-color: #fff;
      border: solid 2px #0055ff;
      padding: 0.25em .5em;
      border-radius: 1em;
      @media (hover: hover) and (pointer: fine) {
        :hover {
          cursor: pointer;
          border: 2px solid #0096ff;
          color: #0096ff;
        }
      }
      @media screen and (max-width: 768px ){
        font-size: 12px;
      }
    }
  }
`;

const CommentsList = styled.div`
  height: 100px;
  overflow-y: auto;
  margin-top: 20px;
  @media screen and (max-width: 768px ){
    height: 88px;
    margin-top: 15px;
  }
  ::-webkit-scrollbar {
    width: 8px;
    @media screen and (max-width: 768px ){
      width: 7.5px;
    }
  }
  ::-webkit-scrollbar-track {
    box-shadow: inset 0 0 2px #c4c4c4;
    border-radius: 10px;
  }
  ::-webkit-scrollbar-thumb {
    background-color: #ccc;
    border-radius: 10px;
    :hover {
      background-color: #999;
    }
  }
  ul {
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 5px;
    margin: 0;
    background-color: #f8f8f8;
  }
  li {
    font-size: 15px;
    padding: 5px 0 5px 5px;
    background-color: #fff;
    @media screen and (max-width: 768px ){
      font-size: 12px;
    }
  }
`;

const Blog = (props) => {
  const { id } = useParams();
  const blog = props.blogs.find(blog => blog.id === id);

  const handleLikes = () => {
    props.likeBlog({ ...blog, likes: blog.likes + 1, user: blog.user.id  })
  }

  const handleRemove = () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      props.removeBlog(blog.id)
    }
  }

  if ( !blog ) {
    return null
  }

  return (
    <MainContainer>
      <BlogContainer>
        <h2>{blog.title}</h2>
        <a href='#'>{blog.url}</a>
        <InfoContainer>
          <p>Added by {blog.user.name}</p>
          <div>
            <p>{blog.likes} likes</p>
            <button onClick={handleLikes}>like</button>
          </div>
        </InfoContainer>
      </BlogContainer>
      <CommentsContainer >
        <h3>Comments</h3>
        <CommentForm blog={blog.id}/>
        <CommentsList>
          <ul>
            {blog.comments.map((comment, i) =>
              <li key={i}>{comment}</li>
            )}
          </ul>
        </CommentsList>
      </CommentsContainer>
    </MainContainer>
  )
}

const mapDispatchToProps = dispatch => {
  return {
    removeBlog: value => {
      dispatch(removeBlog(value))
    },
    likeBlog: value => {
      dispatch(likeBlog(value))
    }
  }
}

const mapStateToProps = (state) => {
  const blogs = state.blogs;
  const user = state.login;
  return {
    blogs,
    user
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Blog)