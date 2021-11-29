import { mount } from '@vue/test-utils'
import axios from 'axios'
import Search from '../components/Search'
// import ProductCard from '../components/ProductCard'
import ProductList from '.'

jest.mock('axios', () => ({
  get: jest.fn(),
}))

describe('ProductList -integration', () => {
  it('should mount the component', () => {
    const wrapper = mount(ProductList)

    expect(wrapper.vm).toBeDefined()
  })

  it('should mount the Search component as child', () => {
    const wrapper = mount(ProductList)

    expect(wrapper.findComponent(Search)).toBeDefined()
  })

  it('should call axios get on component mount', () => {
    mount(ProductList, {
      mocks: {
        $axios: axios,
      },
    })
    expect(axios.get).toHaveBeenCalledTimes(1)
    expect(axios.get).toHaveBeenLastCalledWith('/api/products')
  })
})
