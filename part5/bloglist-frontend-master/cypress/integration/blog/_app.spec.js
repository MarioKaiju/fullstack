describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3001/api/testing/reset')
    const user = {
      name: 'Tester',
      username: 'tester',
      password: 'testing'
    }
    cy.request('POST', 'http://localhost:3001/api/users/', user) 
    cy.visit('http://localhost:3000')
  })

  it('Login form is shown', function() {
    cy.get("#username")
    cy.get("#password")
    cy.get("#login-button")
  })

  describe('Login',function() {
    it('succeeds with correct credentials', function() {
      cy.get("#username").type('tester')
      cy.get("#password").type('testing')
      cy.get("#login-button").click()

      cy.contains('tester is logged in')
    })

    it('fails with wrong credentials', function() {
      cy.get("#username").type('tester')
      cy.get("#password").type('testin')
      cy.get("#login-button").click()

      cy.get('.error')
        .should('contain', 'Wrong username or Password') 
        .and('have.css', 'color', 'rgb(255, 0, 0)')
        .and('have.css', 'border-style', 'solid')

      cy.get('html').should('not.contain', 'tester logged in')
    })
  })

  describe('When logged in', function() {
    beforeEach(function() {
      cy.login({ username: 'tester', password: 'testing' })
    })

    it('A blog can be created', function() {
      cy.contains('create new blog').click()

      cy.get("#title").type('Adding a blog with cypress tester')
      cy.get("#author").type('cypress test')
      cy.get("#url").type('No url')

      cy.get("#create").click()

      cy.get('.message')
        .should('contain', 'a new blog Adding a blog with cypress tester by cypress test added')
        .and('have.css', 'color', 'rgb(0, 128, 0)')
        .and('have.css', 'border-style', 'solid')

      cy.get('html')
        .should('contain', 'Adding a blog with cypress tester cypress test')
    })

    describe('and a blog exists', function() {
      beforeEach(function() {
        cy.createBlog({ title: 'A new blog', author: 'cypress test', url: 'no url', likes: 0 })
      })
      
      it('it can be removed', function() {
        cy.contains('view').click()
        cy.get("#remove").click()

        cy.get('html').should('not.contain', 'A new blog cypress test')
      })

      it('it can be liked', function() {
        cy.contains('view').click()
        cy.get('#like').click()
      })
    })

    describe.only('and several blogs exits', function() {
      beforeEach(function() {
        cy.createBlog({ title: 'A new blog', author: 'cypress test', url: 'no url', likes: 10 })
        cy.createBlog({ title: 'A new blog', author: 'cypress test', url: 'no url', likes: 12 })
        cy.createBlog({ title: 'A new blog', author: 'cypress test', url: 'no url', likes: 15 })
      })

      it('sorts the blogs by number of likes', function() {
          cy.get('.blogContent').find('#view').click({multiple: true})
          cy.get('.blogContent').first().should('contain', '15')
      })
    })
  })
})