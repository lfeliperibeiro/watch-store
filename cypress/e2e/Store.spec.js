import { makeServer } from '../../miragejs/server'

context('Store', () => {
  let server
  const g = cy.get
  beforeEach(() => {
    server = makeServer({ environment: 'test' })
  })

  afterEach(() => {
    server.shutdown()
  })
  it('should display the store', () => {
    cy.visit('/')

    g('body').contains('Brand')
    g('body').contains('Wrist Watch')
  })

  context('Store > Shopping Cart', () => {
    beforeEach(() => {
      server.createList('product', 10)
      cy.visit('/')
    })
    it('should not display shopping cart when page first loads', () => {
      g('[data-testid="shopping-cart"]').should('have.class', 'hidden')
    })

    it('should toggle shopping cart visibility when button is clicked', () => {
      g('[data-testid="toggle-button"]').as('toggleButton')
      g('@toggleButton').click()
      g('[data-testid="shopping-cart"]').should('not.have.class', 'hidden')
      g('@toggleButton').click({ force: true })
      g('[data-testid="shopping-cart"]').should('have.class', 'hidden')
    })

    it('should open shopping cart when a product is added', () => {
      g('[data-testid="product-card"]').first().find('button').click()
      g('[data-testid="shopping-cart"]').should('not.have.class', 'hidden')
    })

    it('should add first product to the cart', () => {
      g('[data-testid="product-card"]').first().find('button').click()
      g('[data-testid="cart-item"]').should('have.length', 1)
    })

    it.only('should add 3 products to the cart', () => {
      g('[data-testid="product-card"]').eq(1).find('button').click()
      g('[data-testid="product-card"]').eq(4).find('button').click()
      g('[data-testid="product-card"]').eq(6).find('button').click()
      g('[data-testid="cart-item"]').should('have.length', 3)
    })
  })

  context('Store > Product List', () => {
    it('should display "0 products" when no products is returned', () => {
      cy.visit('/')
      g('[data-testid="product-card"]').should('have.length', 0)
      g('body').contains('0 products')
    })

    it('should display "1 product" when 1 product is returned', () => {
      server.create('product')
      cy.visit('/')
      g('[data-testid="product-card"]').should('have.length', 1)
      g('body').contains('1 product')
    })

    it('should display "10 products" when 10 products are returned', () => {
      server.createList('product', 10)
      cy.visit('/')
      g('[data-testid="product-card"]').should('have.length', 10)
      g('body').contains('10 products')
    })
  })

  context('Store > Search for products', () => {
    it('should type in the search field ', () => {
      cy.visit('/')
      g('input[type=search]')
        .type('Some text here')
        .should('have.value', 'Some text here')
    })

    it('should return 1 product when "relogio" is used as search term', () => {
      server.create('product', {
        title: 'relogio',
      })
      server.createList('product', 10)

      cy.visit('/')

      g('input[type="search"]').type('relogio')
      g('[data-testid="search-form"]').submit()

      g('[data-testid="product-card"]').should('have.length', 1)
    })

    it('should not return any product', () => {
      server.create('product')
      server.createList('product', 10)

      cy.visit('/')

      g('input[type="search"]').type('relogio')
      g('[data-testid="search-form"]').submit()

      g('[data-testid="product-card"]').should('have.length', 0)
      g('body').contains('0 products')
    })
  })
})
