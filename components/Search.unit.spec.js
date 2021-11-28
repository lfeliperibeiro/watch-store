import { mount } from '@vue/test-utils'
import Search from './Search'

describe('Search -unit', () => {
  it('should mount the component', () => {
    const wrapper = mount(Search)
    expect(wrapper.vm).toBeDefined()
  })
})
