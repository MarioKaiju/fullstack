import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import './index.css';

const Statistic = (props) => (
  <tr>
    <td>{props.text}:</td>
    <td>{props.value}</td>
  </tr>)

const Statistics = (props) => {
  const {good, neutral, bad} = props
  const all = good + neutral + bad
  if (all > 0 ) {
    return (
    <table>
      <tbody>
        <Statistic text="good" value={good}/>
        <Statistic text="neutral" value={neutral}/>
        <Statistic text="bad" value={bad}/>
          <tr>
            <td>Good:</td>
            <td>{good}</td>
          </tr>
          <tr>
            <td>Neutral:</td>
            <td>{neutral}</td>
          </tr>
          <tr>
            <td>Bad:</td>
            <td>{bad}</td>
          </tr>
          <tr>
            <td>All:</td>
            <td>{all}</td>
          </tr>
          <tr>
            <td>Average:</td>
            <td>{(good + bad *-1 ) / (all)}</td>
          </tr>
          <tr>
            <td>Positive:</td>
            <td>{good * 100 / all} %</td>
          </tr>
      </tbody>
    </table>
    )
  }

  return (
    <div>
      <p>No feedback given</p>
    </div>
  )
}

const Button = (props) => {
  const {text, handleClick} = props
  return (
      <button onClick={handleClick}>{text}</button>
  )
}

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <div>
      <h1>Display feedback</h1>
      <Button handleClick={ () => setGood (good + 1)} text="Good"></Button>
      <Button handleClick={ () => setNeutral (neutral + 1)} text="Neutral"></Button>
      <Button handleClick={ () => setBad (bad + 1)} text="Bad"></Button>
      <h2>Statistics</h2>
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

ReactDOM.render(<App  />, document.getElementById('root'))