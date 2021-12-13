import { mount } from '@vue/test-utils'
import { CartManager } from '../managers/CartManager'
import ProductCard from './ProductCard'
import { makeServer } from '@/miragejs/server'

const mountProductCard = (server) => {
  const product = server.create('product', {
    title: 'Relogio',
    price: '25.00',
    image:
      'https://images.unsplash.com/photo-1495857000853-fe46c8aefc30?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80',
  })

  const cartManager = new CartManager()

  const wrapper = mount(ProductCard, {
    propsData: {
      product,
    },
    mocks: {
      $cart: cartManager,
    },
  })

  return {
    wrapper,
    product,
    cartManager,
  }
}

describe('ProductCard -unit', () => {
  let server
  beforeEach(() => {
    server = makeServer({ environment: 'test' })
  })
  afterEach(() => {
    server.shutdown()
  })

  it('should match snapshot', () => {
    const { wrapper } = mountProductCard(server)

    expect(wrapper.element).toMatchSnapshot()
  })
  it('should mount the component', () => {
    const { wrapper } = mountProductCard(server)

    expect(wrapper.vm).toBeDefined()
    expect(wrapper.text()).toContain('Relogio')
    expect(wrapper.text()).toContain('25.00')
  })

  it('should add item to cartState on button click', async () => {
    const { wrapper, cartManager, product } = mountProductCard(server)

    const spy1 = jest.spyOn(cartManager, 'open')
    const spy2 = jest.spyOn(cartManager, 'addProduct')

    await wrapper.find('button').trigger('click')

    expect(spy1).toHaveBeenCalledTimes(1)
    expect(spy2).toHaveBeenCalledTimes(1)
    expect(spy2).toHaveBeenCalledWith(product)
  })
})
