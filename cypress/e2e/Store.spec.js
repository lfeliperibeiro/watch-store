import { makeServer } from '../../miragejs/server'

context('Store', () => {
  let server
  beforeEach(() => {
    server = makeServer({ environment: 'test' })
  })

  afterEach(() => {
    server.shutdown()
  })
  it('should display the store', () => {
    cy.visit('http://localhost:3000')

    cy.get('body').contains('Brand')
    cy.get('body').contains('Wrist Watch')
  })

  context('Store > Search for products', () => {
    it('should type in the search field ', () => {
      cy.visit('http://localhost:3000')
      cy.get('input[type=search]')
        .type('Some text here')
        .should('have.value', 'Some text here')
    })

    it('should return 1 product when "relogio" is used as search term', () => {
      server.create('product', {
        title: 'relogio',
      })
      server.createList('product', 10)

      cy.visit('http://localhost:3000')

      cy.get('input[type="search"]').type('relogio')
      cy.get('[data-testid="search-form"]').submit()

      cy.get('[data-testid="product-card"]').should('have.length', 1)
    })

    it('should not return any product', () => {
      server.create('product')
      server.createList('product', 10)

      cy.visit('http://localhost:3000')

      cy.get('input[type="search"]').type('relogio')
      cy.get('[data-testid="search-form"]').submit()

      cy.get('[data-testid="product-card"]').should('have.length', 0)
      cy.get('body').contains('0 products')
    })
  })
})
