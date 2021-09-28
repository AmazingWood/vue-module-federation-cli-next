import Vuex from 'vuex'
import getters from './getters'
import app from './modules/app.js'

const store = new Vuex.Store({
  modules: {
    app
  },
  getters
})

export default store
