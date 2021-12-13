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

  it.todo('should  toggle Cart visibility')
})
