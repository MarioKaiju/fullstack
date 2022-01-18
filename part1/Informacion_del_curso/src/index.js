import React from 'react';
import ReactDOM from 'react-dom';

const Header  = ({course}) => (
  <h1>{course}</h1>
)

const Part = ({part}) => {
  const {name, exercises} = part
  return (
    <p>
      {name} {exercises}
    </p>
  )
}

const Content = ({parts}) => {
  return (
    <div>
      <Part part={parts[0]} />
      <Part part={parts[1]} />
      <Part part={parts[2]} />
    </div>
  )
}

const Total = ({parts}) => (
  <p>Number of exercises {parts[0].exercises + parts[1].exercises + parts[2].exercises}</p>
)

const App = () => {
  const course = {
    name : 'Half Stack application development',
    parts : [
      { name:'Fundamentals of React', exercises: 10 },
      { name: 'Using props to pass data', exercises: 7 },
      { name:'State of a component', exercises: 14 }
    ]
  }
  
  return (
    <div>
      <Header course={course.name} />
      <Content parts={course.parts}/>
      <Total parts={course.parts}/>
    </div>
  )
}

ReactDOM.render(<App/>, document.getElementById('root'))