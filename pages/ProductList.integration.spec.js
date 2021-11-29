import { mount } from '@vue/test-utils'
import Search from '../components/Search'
import ProductList from '.'
// import ProductCard from '../components/ProductCard'

describe('ProductList -integration', () => {
  it('should mount the component', () => {
    const wrapper = mount(ProductList)

    expect(wrapper.vm).toBeDefined()
  })

  it('should mount the Search component as child', () => {
    const wrapper = mount(ProductList)

    expect(wrapper.findComponent(Search)).toBeDefined()
  })
})
