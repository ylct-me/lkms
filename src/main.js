import '@/plugins';
import i18n from '@/plugins/i18n';
import vuetify from '@/plugins/vuetify';
import '@/registerServiceWorker';
import router from '@/router';
import store from '@/store';
import Vue from 'vue';
import VuetifyConfirm from 'vuetify-confirm';
import App from './App.vue';


Vue.config.productionTip = false

Vue.use(VuetifyConfirm, {
  vuetify,
})

new Vue({
  router,
  store,
  i18n,
  vuetify,
  render: h => h(App),
  async created() {
    await import('@/plugins/axios')
  }
}).$mount('#app')
