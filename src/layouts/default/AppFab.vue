<template>
  <v-fab-transition>
    <v-btn
      v-show="fab"
      v-scroll="onScroll"
      aria-label="Scroll to top"
      bottom
      small
      color="red"
      dark
      fab
      fixed
      right
      title="Scroll to top"
      @click="toTop"
    >
      <v-icon>mdi-arrow-up-thick</v-icon>
    </v-btn>
  </v-fab-transition>
</template>

<script>
  export default {
    name: 'DefaultAppFab',
    data: () => ({
      fab: false,
      timer: null
    }),
    methods: {
      onScroll() {
        if (typeof window === 'undefined') return
        const top = window.pageYOffset || document.documentElement.offsetTop || 0
        this.fab = top > 300
        if(this.timer) {
          return
        }
        this.timer = setTimeout(() => {
          this.fab = false
          clearTimeout(this.timer)
          this.timer = null
        }, 3000)
      },
      toTop() {
        this.$vuetify.goTo(0)
      },
    },
  }
</script>
