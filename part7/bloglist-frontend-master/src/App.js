import React, { useEffect } from 'react'
import { connect, useDispatch } from 'react-redux'
import BlogList from './components/BlogList'
import LoginForm from './components/LoginForm'
import Notification from './components/Notification'
import { initializeBlogs } from './reducers/blogReducer'
import { loged, logout } from './reducers/loginReducer'
import { Link, Route, Routes } from 'react-router-dom'
import Users from './components/Users'
import User from './components/User'
import { initializeUsers } from './reducers/userReducer'
import Blog from './components/Blog'
import styled from 'styled-components'

const Login = styled.div`
  outline: 2px solid #0055ff;
  width: calc(94% - 50px);
  margin: 50px auto;
  display: flex;
  flex-direction: column;
  max-width: 400px;
  padding: 25px;
  border-radius: 25px;
  gap: 20px;
  font-size: 18px;
  @media (max-width: 900px) and (orientation: landscape) {
    margin: 25px auto;
  }
  @media screen and (max-width: 768px) {
    padding: 15px;
    border-radius: 15px;
    gap: 10px;
    font-size: 15px;
    max-width: 270px;
  }
  h2 {
    text-align: center;
    font-size: 20px;
    margin-block-end: unset;
    margin-block-start: unset;
    border-bottom: #c4c4c4 solid 1px;
    padding-bottom: 5px;
    @media screen and (max-width: 768px) {
      font-size: 15px;
    }
  }
  div {
    display: flex;
    align-items: flex-end;
    gap: 20px;
    justify-content:space-between;
    margin-bottom: 20px;
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
    border-radius: calc(0.5em + 5px);
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
  button {
    border: none;
    background-color: #701abf;
    padding: 0.5em 1em;
    font-size: 15px;
    min-width: 100px;
    color: #fff;
    border-radius: 1.5em;
    @media (hover: hover) and (pointer: fine) {
      :hover {
        cursor: pointer;
        background-color: #9026f1;
        color: #aaa;
      }
    }
    @media screen and (max-width: 768px) {
      font-size: 12px;
      min-width: 60px;
    }
  }
`;

const NavBarContainer = styled.div`
  background-color: #1d56c9;
`;

const NavBar = styled.div`
  display: flex;
  justify-content: space-between;
  max-width: calc(1200px);
  padding: 0 3%;
  margin: auto;
  div {
    display: flex;
    gap: 20px;
    align-items: center;
    @media screen and (max-width: 768px) {
      gap: 10px;
    }
  }
  a {
    color: #fff;
    text-decoration: none;
    font-size: 25px;
    padding: 20px 0;
    @media (hover: hover) and (pointer: fine) {
      :hover {
        color: #aaa;
      }
    }
    @media screen and (max-width: 768px) {
      font-size: 18px;
    }
  }
  p {
    color: #fff;
    font-size: 15px;
    @media screen and (max-width: 768px) {
      font-size: 10px;
    }
    @media screen and (max-width: 320px) {
      display: none;
    }
  }
  button {
    font-size: 15px;
    background-color: #701abf;
    padding: .5em 1em;
    border: none;
    border-radius: 20px;
    color: #fff;
    @media (hover: hover) and (pointer: fine) {
        :hover {
        cursor: pointer;
        color: #c5c5c5;
        background-color: #9026f1;
      }
    }
    @media screen and (max-width: 768px) {
      font-size: 10px;
    }
  }
`;

const Container = styled.div`
  max-width: 1200px;
  margin: auto;
  padding: 0 3%;
  h1 {
    font-size: 30px;
    text-align: center;
    margin: 50px 0;
    @media screen and (max-width: 768px) {
      font-size: 20px;
      margin: 25px 0;
    }
  }
`;

const App = (props) => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(initializeBlogs())
    dispatch(initializeUsers())
  }, [dispatch])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      dispatch(loged(user))
    }
  }, [])

  const handleLogout = () => {
    dispatch(logout())
  }

  return (
    <>
      <Notification />
      {props.user === null ?
        <Login>
          <h2>Log in to application</h2>
          <LoginForm />
        </Login>
        :
        <div>
          <NavBarContainer>
            <NavBar>
                <div>
                  <Link to={""}>blogs</Link>
                  <Link to={"/users"}>users</Link>
                </div>
                <div>
                  <p>{props.user.username} is logged in</p>
                  <button onClick={handleLogout}>logout</button>
                </div>
            </NavBar>
          </NavBarContainer>
          <Container>
            <h1>blog app</h1>
            <Routes>
              <Route path="/" element={<BlogList />} />
              <Route path="/users" element={<Users />} />
              <Route path="/users/:id" element={<User /> } />
              <Route path="/blogs/:id" element={<Blog /> } />
            </Routes>
          </Container>
        </div>
      }
    </>
  )
}

const mapStateToProps = (state) => {
  const user = state.login;
  return {
    user
  }
}

export default connect(
  mapStateToProps,
)(App)