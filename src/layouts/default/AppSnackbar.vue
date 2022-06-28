<template>
  <v-snackbar v-model="snackbar.show" :timeout="3000" app top centered :color="snackbar.color">
    {{ $t(snackbar.text) }}
    <template #action="{ attrs }">
      <v-btn icon v-bind="attrs" @click="hideSnackbar">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script>
  import { get, call } from 'vuex-pathify'

  export default {
    name: 'DefaultAppSnackbar',
    computed: {
      snackbar: get('snackbar/snackbar'),
    },
    methods: {
      hideSnackbar: call('snackbar/hideSnackbar')
    }
  }
</script>
