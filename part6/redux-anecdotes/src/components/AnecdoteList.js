import React from "react";
import { connect } from "react-redux";
import { voteAnecdote } from "../reducers/anecdoteReducer";
import { setNotification } from "../reducers/notificationReducer";

const AnecdoteList = (props) => {
  const vote = (anecdote) => {
    props.voteAnecdote(anecdote)
    props.setNotification(anecdote)
  }

  return (
    <div>
      {props.anecdotes.map(anecdote =>
        <div key={anecdote.id}>
        <div>
        {anecdote.content}
        </div>
        <div>
        has {anecdote.votes}
            <button onClick={() => vote(anecdote)}>vote</button>
          </div>
        </div>
      )}
    </div>
  )
}

const mapStateToProps = (state) => {
  const anecdotes = state.anecdotes.filter(anecdote =>
    anecdote.content.toLowerCase().includes(state.filter)
  )

  anecdotes.sort((a, b) =>  {
    return a.votes > b.votes ? -1 : 1;
  })

  return {
    anecdotes
  }
}

const mapDispatchToProps = dispatch => {
  return {
    voteAnecdote: value => {
      dispatch(voteAnecdote(value))
    },
    setNotification: value => {
      dispatch(setNotification(`you voted '${value.content}'`, 10))
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AnecdoteList)