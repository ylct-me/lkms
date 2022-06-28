// Pathify
import { make } from 'vuex-pathify'

// Data
const state = {
  snackbar: {
    show: false,
    text: '',
    color: '',
  },
}

const mutations = make.mutations(state)

const actions = {
  showSnackbar({ commit }, { color, text}) {
    commit('snackbar', {
      show: true,
      color,
      text
    })
  },
  hideSnackbar({ commit }) {
    commit('snackbar', {
      show: false,
    })
  }
}

const getters = {
  snackbar: (state) => state.snackbar,
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
}
