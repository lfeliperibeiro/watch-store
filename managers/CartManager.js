import Vue from 'vue'

const initialState = {
  open: false,
  items: [],
}

export class CartManager {
  state

  constructor() {
    this.state = Vue.observable(initialState)
  }

  open() {
    this.state.open = true

    return this.state
  }
}
