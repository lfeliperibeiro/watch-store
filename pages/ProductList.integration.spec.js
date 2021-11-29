import { mount } from '@vue/test-utils'
import ProductList from '.'
// import ProductCard from '../components/ProductCard'
// import Search from '../components/Search'

describe('ProductList -integration', () => {
  it('should mount the component', () => {
    const wrapper = mount(ProductList)

    expect(wrapper.vm).toBeDefined()
  })
})
