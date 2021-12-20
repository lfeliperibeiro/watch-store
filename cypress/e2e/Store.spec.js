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
    cy.visit('/')

    cy.get('body').contains('Brand')
    cy.get('body').contains('Wrist Watch')
  })

  context('Store > Product List', () => {
    it('should display "0 products" when no products is returned', () => {
      cy.visit('/')
      cy.get('[data-testid="product-card"]').should('have.length', 0)
      cy.get('body').contains('0 products')
    })

    it('should display "1 product" when 1 product is returned', () => {
      server.create('product')
      cy.visit('/')
      cy.get('[data-testid="product-card"]').should('have.length', 1)
      cy.get('body').contains('1 product')
    })

    it('should display "10 products" when 10 products are returned', () => {
      server.createList('product', 10)
      cy.visit('/')
      cy.get('[data-testid="product-card"]').should('have.length', 10)
      cy.get('body').contains('10 products')
    })
  })

  context('Store > Search for products', () => {
    it('should type in the search field ', () => {
      cy.visit('/')
      cy.get('input[type=search]')
        .type('Some text here')
        .should('have.value', 'Some text here')
    })

    it('should return 1 product when "relogio" is used as search term', () => {
      server.create('product', {
        title: 'relogio',
      })
      server.createList('product', 10)

      cy.visit('/')

      cy.get('input[type="search"]').type('relogio')
      cy.get('[data-testid="search-form"]').submit()

      cy.get('[data-testid="product-card"]').should('have.length', 1)
    })

    it('should not return any product', () => {
      server.create('product')
      server.createList('product', 10)

      cy.visit('/')

      cy.get('input[type="search"]').type('relogio')
      cy.get('[data-testid="search-form"]').submit()

      cy.get('[data-testid="product-card"]').should('have.length', 0)
      cy.get('body').contains('0 products')
    })
  })
})
