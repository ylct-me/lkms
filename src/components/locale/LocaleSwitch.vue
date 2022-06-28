<template>
  <v-menu
    offset-y
    origin="center center"
    rounded
    transition="scale-transition"
  >
    <template #activator="{ on }">
      <v-btn
        slot="activator"
        text
        v-on="on"
      >
        <v-icon medium>
          mdi-translate
        </v-icon>
        <span class="ml-2"> {{ computeLocaleText() }} </span>
      </v-btn>
    </template>
    <v-list>
      <v-list-item-group v-model="locale">
        <v-list-item
          v-for="item in availableLanguages"
          :key="item.value"
          :value="item.value"
          @click="handleChangeLocale(item)"
        >
          <v-list-item-title v-text="item.text" />
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </v-menu>
</template>

<script>
  import { sync, call } from 'vuex-pathify'
  import i18n from '@/plugins/i18n'

  export default {
    computed: {
      locale: sync('app/locale'),
      availableLanguages() {
        const { messages } = i18n
        return Object.keys(messages).map((lang) => {
          return {
            text: messages[lang][lang],
            value: lang,
          }
        })
      },
    },
    methods: {
      setLocale: call('app/setLocale'),
      computeLocaleText() {
        if (!this.locale) {
          return this.$t(i18n.locale)
        }
        return this.$t(this.locale)
      },
      handleChangeLocale(locale) {
        this.setLocale(locale)
      },
    },
  }
</script>

<style></style>
