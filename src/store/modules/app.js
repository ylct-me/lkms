// Pathify
import i18n from "@/plugins/i18n";
import { make } from "vuex-pathify";

// Data
const state = {
  locale: "zh",
  drawer: true
};

const mutations = {
  ...make.mutations(state)
};

const actions = {
  ...make.actions(state),
  setLocale({ commit }, language) {
    i18n.locale = language;
    commit("locale", language);
  }
};

const getters = {
  drawer: state => state.drawer,
  locale: state => state.locale
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
