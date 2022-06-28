/**
 * Vuetify Vue CLI Preset
 *
 * store/index.js
 *
 * vuex documentation: https://vuex.vuejs.org/
 */

// Vue
// Utilities
// https://davestewart.github.io/vuex-pathify/#/
import pathify from "@/plugins/vuex-pathify";
import Vue from "vue";
import Vuex from "vuex";
import VuexPersistence from "vuex-persist";
// Modules
// https://vuex.vuejs.org/guide/modules.html
import modules from "./modules";

const vuexLocal = new VuexPersistence({
  key: "lkms",
  storage: window.localStorage,
  modules: ["app", "auth", "project"]
});

Vue.use(Vuex);

export default new Vuex.Store({
  modules,
  plugins: [pathify.plugin, vuexLocal.plugin]
});

// A reusable const for making root commits and dispatches
// https://vuex.vuejs.org/guide/modules.html#accessing-global-assets-in-namespaced-modules
export const ROOT_DISPATCH = Object.freeze({ root: true });
