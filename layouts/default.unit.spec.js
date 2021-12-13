import { mount } from '@vue/test-utils'
import Cart from '../components/Cart'
import { CartManager } from '../managers/CartManager'
import DefaultLayout from './default'

describe('Default Layout', () => {
  const mountLayout = () => {
    const wrapper = mount(DefaultLayout, {
      mocks: {
        $cart: new CartManager(),
      },
      stubs: {
        Nuxt: true,
      },
    })
    return { wrapper }
  }
  it('should mount Cart', () => {
    const { wrapper } = mountLayout()

    expect(wrapper.findComponent(Cart).exists()).toBe(true)
  })

  it('should toggle Cart visibility', async () => {
    const { wrapper } = mountLayout()
    const button = wrapper.find('[data-testid="toggle-button"]')

    await button.trigger('click')
    expect(wrapper.vm.isCartOpen).toBe(true)
    await button.trigger('click')
    expect(wrapper.vm.isCartOpen).toBe(false)
  })
})
