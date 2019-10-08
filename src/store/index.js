import Vue from 'vue'
import Vuex from 'vuex'

import podcastStore from './podcastStore'

Vue.use(Vuex)

export default function () {
  const Store = new Vuex.Store({
    modules: {
      podcastStore
    },

    strict: process.env.DEV
  })

  return Store
}
