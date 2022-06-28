
import en from "@/locale/en.json";
import zhHans from "@/locale/zh-Hans.json";
import store from '@/store';
import Vue from "vue";
import VueI18n from "vue-i18n";

Vue.use(VueI18n);

const translation = {
  zh: zhHans,
  en: en,
};

const i18n = new VueI18n({
  locale: store.get("app/locale"),
  fallbackLocale: 'zh',
  silentFallbackWarn: true,
  messages: translation, // set locale messages
});

export default i18n;
