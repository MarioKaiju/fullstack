import React from "react"
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import styled from "styled-components";
import BlogForm from "./BlogForm";
import Togglable from "./Togglable";

const MainContaier = styled.div`
  button {
    border: none;
    background-color: #701abf;
    padding: 0.5em 1em;
    font-size: 18px;
    min-width: 100px;
    color: #fff;
    @media (hover: hover) and (pointer: fine) {
      :hover {
        cursor: pointer;
        background-color: #9026f1;
        color: #aaa;
      }
    }
    @media screen and (max-width: 768px) {
      font-size: 15px;
    }
  }
`;

const List = styled.div`
  margin: 15px 0 50px;
  display: grid;
  grid-template-columns: 1fr;
  a {
    padding: 10px 0.5em;
    color: #000;
    font-weight: 700;
    text-decoration: none;
    font-size: 18px;
    @media (hover: hover) and (pointer: fine) {
      :hover {
        color: #333;
      }
    }
    @media screen and (max-width: 768px) {
      font-size: 15px;
    }
  }
`;

const BlogList = (props) => {
  props.blogs.sort(function (a,b) {
    return b.likes - a.likes
  })

  
  return (
    <MainContaier >
      <Togglable buttonLabel='create new' >
        <BlogForm />
      </Togglable>
      <List >
        {props.blogs.map((blog, i) =>
          i%2 !== 0 ? 
            <Link key={i} to={`/blogs/${blog.id}`}>{blog.title} - {blog.author}</Link>
          :
            <Link key={i} to={`/blogs/${blog.id}`} style={{backgroundColor: "#a6bff2"}}>{blog.title} - {blog.author}</Link>
        )}
      </List>
    </MainContaier>
  )
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
)(BlogList)

