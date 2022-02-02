import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import Blog from './Blog'

describe('<Blog />', () => {
  let component

  const blog = {
    url: "nourl",
    title: "No title",
    author: "No author",
    likes: 5,
    user: {
      username: "tester",
      name: "Tester",
    }
  }

  const mockHandler = jest.fn()

  const user = {
    username: "tester",
    name: "Tester"
  }

  beforeEach(() => {
    component = render(
      <Blog blog={blog} user={user} updateBlog={mockHandler} />
    )
  })

  test('renders title and author', () => {
    const div = component.container.querySelector('.blogContent')
    expect(div).toHaveTextContent('No title No author')
    expect(div).not.toHaveTextContent('likes nourl')
  })

  test('renders url and likes after button click', () => {
    const div = component.container.querySelector('.blogContent')
    const button = component.getByText('view')
    fireEvent.click(button)
    expect(div).toHaveTextContent('likes')
    expect(div).toHaveTextContent('url')
  })

  test('fires like event', () => {

    const button = component.getByText('view')
    fireEvent.click(button)
    const likesbutton = component.getByText('like')
    fireEvent.click(likesbutton)
    fireEvent.click(likesbutton)
    expect(mockHandler.mock.calls).toHaveLength(2)
  })
})