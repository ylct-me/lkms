/**
 * plugins/vuetify.js
 *
 * Vuetify documentation: https://vuetifyjs.com/
 */

 // Imports
import Vue from 'vue'
import Vuetify from 'vuetify/lib'
import colors from 'vuetify/lib/util/colors'
import i18n from './i18n'

Vue.use(Vuetify)

export default new Vuetify({
  lang: {
    t: (key, ...params) => i18n.t(key, params),
  },
  // https://vuetifyjs.com/en/features/theme/#theme-generator
  theme: {
    // options: {
    //   customProperties: true,
    // },
    themes: {
      light: {
        primary: colors.indigo.base,
      },
    },
  },
})
