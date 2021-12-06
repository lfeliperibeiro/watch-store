import { mount } from '@vue/test-utils'
import { makeServer } from '../miragejs/server'
import CartItem from './CartItem'

const mountCartItem = (server) => {
  const product = server.create('product', {
    title: 'relogio',
    price: '22.33',
  })
  const wrapper = mount(CartItem, {
    propsData: {
      product,
    },
  })

  return {
    wrapper,
    product,
  }
}

describe('CartItem', () => {
  let server
  beforeEach(() => {
    server = makeServer({ environment: 'test' })
  })
  afterEach(() => {
    server.shutdown()
  })
  it('should mount the component', () => {
    const { wrapper } = mountCartItem(server)
    expect(wrapper.vm).toBeDefined()
  })

  it('should display product information', () => {
    const {
      wrapper,
      product: { title, price },
    } = mountCartItem(server)
    const content = wrapper.text()
    expect(content).toContain(title)
    expect(content).toContain(price)
  })

  it('should  display quantity 1 when  product is first displayed', () => {
    const { wrapper } = mountCartItem(server)
    const quantity = wrapper.find('[data-testid="quantity"]')

    expect(quantity.text()).toContain('1')
  })

  it('should increase quantity when + button gets clicked', async () => {
    const { wrapper } = mountCartItem(server)
    const quantity = wrapper.find('[data-testid="quantity"]')
    const button = wrapper.find('[data-testid="+"]')

    await button.trigger('click')
    expect(quantity.text()).toContain('2')
    await button.trigger('click')
    expect(quantity.text()).toContain('3')
    await button.trigger('click')
    expect(quantity.text()).toContain('4')
  })

  it('should decrease quantity when - button gets clicked', async () => {
    const { wrapper } = mountCartItem(server)
    const quantity = wrapper.find('[data-testid="quantity"]')
    const button = wrapper.find('[data-testid="-"]')

    await button.trigger('click')
    expect(quantity.text()).toContain('0')
  })
})
