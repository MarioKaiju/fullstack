import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import BlogForm from './BlogForm'

describe('<BlogForm />', () => {
  test('updates parent states and calls onSubmit', () => {
    const createBlog = jest.fn()
  
    const component = render(
      <BlogForm createBlog={createBlog} />
    )
  
    const authorInput = component.container.querySelector('#author')
    const urlInput = component.container.querySelector('#url')
    const titleInput = component.container.querySelector('#title')
    const form = component.container.querySelector('form')
  
    fireEvent.change(authorInput, { 
      target: { value: 'Tester' } 
    })
    fireEvent.change(urlInput, { 
      target: { value: 'nourl' } 
    })
    fireEvent.change(titleInput, { 
      target: { value: 'No Title' } 
    })
    fireEvent.submit(form)
  
    expect(createBlog.mock.calls).toHaveLength(1)
    expect(createBlog.mock.calls[0][0].author).toBe('Tester' )
    expect(createBlog.mock.calls[0][0].url).toBe('nourl' )
    expect(createBlog.mock.calls[0][0].title).toBe('No Title' )
  })
})