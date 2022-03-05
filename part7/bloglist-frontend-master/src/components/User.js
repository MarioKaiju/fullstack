import React from "react";
import { Link, useParams } from "react-router-dom";
import { connect } from "react-redux";
import styled from 'styled-components'

const MainContainer = styled.div`
  max-width: 950px;
  margin: 0 auto 50px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  border: 2px solid #0055ff;
  border-radius: 25px;
  padding: 25px;
  @media screen and (max-width: 768px) {
    gap: 10px;
    padding: 15px;
    border-radius: 15px;
  }
  h2 {
    font-size: 20px;
    margin-block-end: unset;
    margin-block-start: unset;
    border-bottom: #c4c4c4 solid 1px;
    padding-bottom: 5px;
    @media screen and (max-width: 768px) {
      font-size: 15px;
    }
  }
  h3 {
    font-size: 18px;
    margin-block-end: unset;
    margin-block-start: unset;
    @media screen and (max-width: 768px) {
      margin-bottom: 10px;
      font-size: 13px;
    }
  }
  h4 {
    color: #777;
    font-size: 18px;
    text-align: center;
    margin-block-end: unset;
    margin-block-start: unset;
    @media screen and (max-width: 768px) {
      margin-bottom: 10px;
      font-size: 13px;
    }
  }
`;

const BlogsList = styled.div`
  height: 100px;
  overflow-y: auto;
  margin-top: 20px;
  @media screen and (max-width: 768px ){
    height: 90px;
    margin-top: 15px;
  }
  ::-webkit-scrollbar {
    width: 10px;
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
    @media (hover: hover) and (pointer: fine) {
      :hover {
        background-color: #999;
      }
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
    padding: 5px 5px 5px 0;
    background-color: #fff;
    @media screen and (max-width: 768px ){
      font-size: 12px;
    }
  }
  a {
      text-decoration: none;
      color: #0096ff;
      @media (hover: hover) and (pointer: fine) {
        :hover {
          text-decoration: underline;
          color: #00ccff;
        }
      }
    }
`;

const User = (props) => {
  const { id } = useParams();
  const user = props.users.find(user => user.id === id)
  
  if ( !user ) {
    return (null)
  } 

  return (
    <MainContainer>
      <h2>{user.username}</h2>
      <div>
        <h3>Added blogs</h3>
        <BlogsList>
          {  user.blogs.length > 0 ?
            <ul>
              {user.blogs.map((blog, i) => 
                <li key={i}><Link to={`/blogs/${blog.id}`}>{blog.title}</Link></li>
              )}
            </ul>
            :
            <h4>No blogs added by this user</h4>
            }
        </BlogsList>
      </div>
    </MainContainer>
  )
}

const mapStateToProps = (state) => {
  const users = state.users;
  return {
    users
  }
}

export default connect(
  mapStateToProps,
)(User)