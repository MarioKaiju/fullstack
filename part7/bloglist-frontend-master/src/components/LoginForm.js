import React from "react";
import { connect } from "react-redux";
import { login } from "../reducers/loginReducer";

const LoginForm = (props) => {
  const handleLogin = async (event) => {
    event.preventDefault()
    const username = event.target.username.value;
    const password = event.target.password.value;
    event.target.username.value = '';
    event.target.password.value = '';
    props.login({username, password})
    console.log('logging with', username, password)
  }

  return (
    <form onSubmit={handleLogin}>
      <div>
        <label htmlFor="username">username</label>
        <input id='username' type="text" name="username" />
      </div>
      <div>
        <label htmlFor="password">password</label>
        <input id='password' type="password" name="password" />
      </div>
      <button id='login-button' type="submit">login</button>
    </form>
  )
}

const mapDispatchToProps = dispatch => {
  return {
    login: value => {
      dispatch(login(value))
    }
  }
}

export default connect(
  null,
  mapDispatchToProps
)(LoginForm)