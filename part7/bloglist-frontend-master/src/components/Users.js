import React from "react";
import { connect } from "react-redux";
import styled from 'styled-components';
import { Link } from "react-router-dom";

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
  table {
    border-collapse: collapse;
    max-width: 700px;
    width: 100%;
    margin: 0 auto;
    @media screen and (max-width: 768px) {
      max-width: 500px;
    }
  }
  th {
    background-color: #0055ff;
    font-size: 20px;
    padding: 0.5em 18px;
    border: 2px solid #0055ff;
    :first-of-type { text-align: start; }
    :last-of-type { text-align: end; }
    @media screen and (max-width: 768px) {
      font-size: 15px;
      padding: 0.5em 12px;
      border: 1px solid #0055ff;
    }
  }
  td {
    border: 2px solid #0096ff;
    @media screen and (max-width: 768px) {
      border: 1px solid #0096ff;
    }
  }
  td {
    font-size: 18px;
    padding: 0.5em 1em;
    :last-of-type {
      text-align: end;
    }
    @media screen and (max-width: 768px) {
      font-size: 12px;
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
  }
`;

const Users = (props) => {
  const users = props.users

  return (
    <MainContainer>
      <h2>Users</h2>
      <table >
        <thead>
          <tr>
            <th>Username</th>
            <th>Blogs created</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user =>
            <tr key={user.id}>
              <td><Link  to={`/users/${user.id}`}>{user.username}</Link></td>
              <td>{user.blogs.length}</td>
            </tr>
          )}
        </tbody>
      </table>
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
)(Users)