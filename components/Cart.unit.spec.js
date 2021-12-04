import { mount } from '@vue/test-utils'
import Cart from './Cart'

describe('Cart', () => {
  it('should mount the component', () => {
    const wrapper = mount(Cart)

    expect(wrapper.vm).toBeDefined()
  })
})
