import { mount } from '@vue/test-utils'
import Vue from 'vue'
import { makeServer } from '../miragejs/server'
import { CartManager } from '../managers/CartManager'
import Cart from './Cart'
import CartItem from './CartItem'

describe('Cart', () => {
  let server
  beforeEach(() => {
    server = makeServer({ environment: 'test' })
  })
  afterEach(() => {
    server.shutdown()
  })

  const mountCart = () => {
    const products = server.createList('product', 2)

    const cartManager = new CartManager()

    const wrapper = mount(Cart, {
      propsData: {
        products,
      },
      mocks: {
        $cart: cartManager,
      },
    })
    return { wrapper, products, cartManager }
  }
  it('should mount the component', () => {
    const { wrapper } = mountCart()

    expect(wrapper.vm).toBeDefined()
  })

  it('should not display empty cart button when there are no products', () => {
    const { cartManager } = mountCart()
    const wrapper = mount(Cart, {
      mocks: {
        $cart: cartManager,
      },
    })
    expect(wrapper.find('[data-testid="clear-cart-button"]').exists()).toBe(
      false
    )
  })

  it('should emit close event when button gets clicked', async () => {
    const { wrapper } = mountCart()
    const button = wrapper.find('[data-testid="close-button"]')

    await button.trigger('click')

    expect(wrapper.emitted().close).toBeTruthy()
    expect(wrapper.emitted().close).toHaveLength(1)
  })

  it('should hide the cart when no prop isOpen is passed', () => {
    const { wrapper } = mountCart()
    expect(wrapper.classes()).toContain('hidden')
  })

  it('should display the cart when prop isOpen is passed', async () => {
    const { wrapper } = mountCart()

    await wrapper.setProps({
      isOpen: true,
    })
    expect(wrapper.classes()).not.toContain('hidden')
  })

  it('should display cart is empty when there are  no products', async () => {
    const { wrapper } = mountCart()

    wrapper.setProps({
      products: [],
    })

    await Vue.nextTick()

    expect(wrapper.text()).toContain('Cart is empty')
  })

  it('should display 2 instance of CartItem when 2 product are provided', () => {
    const { wrapper } = mountCart()

    expect(wrapper.findAllComponents(CartItem)).toHaveLength(2)
    expect(wrapper.text()).not.toContain('Cart is empty')
  })

  it('should display a button to clear cart', () => {
    const { wrapper } = mountCart()
    const button = wrapper.find('[data-testid="clear-cart-button"]')
    expect(button.exists()).toBe(true)
  })

  it('should call cartManager clearProducts() when button gets clicked', async () => {
    const { wrapper, cartManager } = mountCart()
    const spy = jest.spyOn(cartManager, 'clearProducts')
    await wrapper.find('[data-testid="clear-cart-button"]').trigger('click')

    expect(spy).toHaveBeenCalledTimes(1)
  })

  it('should display an input type email when there are items in the cart', () => {
    const {wrapper} = mountCart()
    const input = wrapper.find('input[type="email"]');
    expect(input.exists()).toBe(true)
  })

  it('should hide the input type e-mail when there are no items in the cart', async () => {
    const {wrapper} = mountCart()
    wrapper.setProps({
      products: [],
    })

    await Vue.nextTick()

    const input = wrapper.find('input[type="email"]');

    expect(input.exists()).toBe(false)
  })
})
