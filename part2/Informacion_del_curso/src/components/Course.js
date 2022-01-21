import React from "react"

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
      parts.map(part =>
        <Part key={part.id} part={part} />)
    )
  }
  
  const Total = ({parts}) => {
    const total = parts.reduce((s, p)=> s + p.exercises, 0)
    return (
      <h4>Total of {total} exercises </h4>
    )
  }
  
  const Course = ({course}) => (
    <div>
      <Header course={course.name} />
      <Content parts={course.parts}/>
      <Total parts={course.parts}/>
    </div>
  )

export default Course