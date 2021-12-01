import { mount } from '@vue/test-utils'
import axios from 'axios'
import Vue from 'vue'
import Search from '../components/Search'
import ProductCard from '../components/ProductCard'
import { makeServer } from '../miragejs/server'
import ProductList from '.'

jest.mock('axios', () => ({
  get: jest.fn(),
}))

describe('ProductList -integration', () => {
  let server
  beforeEach(() => {
    server = makeServer({ environment: 'test' })
  })
  afterEach(() => {
    server.shutdown()
    jest.clearAllMocks()
  })

  const getProducts = (quantity = 10, override = []) => {
    let overrideList = []
    if (override.length > 0) {
      overrideList = override.map((override) =>
        server.create('product', override)
      )
    }
    return [...server.createList('product', quantity), ...overrideList]
  }

  const mountProductList = async (
    quantity = 10,
    overrides = [],
    shouldReject = false
  ) => {
    const products = getProducts(quantity, overrides)
    if (shouldReject) {
      axios.get.mockReturnValue(Promise.reject(new Error(' ')))
    } else {
      axios.get.mockReturnValue(Promise.resolve({ data: { products } }))
    }

    const wrapper = mount(ProductList, {
      mocks: {
        $axios: axios,
      },
    })

    await Vue.nextTick()

    return { wrapper, products }
  }
  it('should mount the component', async () => {
    const { wrapper } = await mountProductList()

    expect(wrapper.vm).toBeDefined()
  })

  it('should mount the Search component as child', async () => {
    const { wrapper } = await mountProductList()

    expect(wrapper.findComponent(Search)).toBeDefined()
  })

  it('should call axios get on component mount', async () => {
    await mountProductList()
    expect(axios.get).toHaveBeenCalledTimes(1)
    expect(axios.get).toHaveBeenLastCalledWith('/api/products')
  })

  it('should mount the ProductCard component 10 times', async () => {
    const { wrapper } = await mountProductList()
    const cards = wrapper.findAllComponents(ProductCard)

    expect(cards).toHaveLength(10)
  })

  it('should display the error when Promise rejects', async () => {
    const { wrapper } = await mountProductList(0, [], true)

    expect(wrapper.text()).toContain('Problemas ao carregar a lista!')
  })

  it('should filter the product list when asearch is performed', async () => {
    const { wrapper } = await mountProductList(10, [
      {
        title: 'meu relogio',
      },
      {
        title: 'outro relogio',
      },
    ])

    const search = wrapper.findComponent(Search)
    search.find('input[type="search"]').setValue('relogio')
    await search.find('form').trigger('submit')

    const cards = wrapper.findAllComponents(ProductCard)
    expect(wrapper.vm.searchTerm).toEqual('relogio')
    expect(cards).toHaveLength(2)
  })

  it('should filter the product list when asearch is performed', async () => {
    const { wrapper } = await mountProductList(10, [
      {
        title: 'meu relogio',
      },
    ])

    const search = wrapper.findComponent(Search)
    search.find('input[type="search"]').setValue('relogio')
    await search.find('form').trigger('submit')
    search.find('input[type="search"]').setValue('')
    await search.find('form').trigger('submit')

    const cards = wrapper.findAllComponents(ProductCard)
    expect(wrapper.vm.searchTerm).toEqual('')
    expect(cards).toHaveLength(11)
  })
})
