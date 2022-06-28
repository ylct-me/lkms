<template>
  <v-app>
    <default-app-drawer />

    <default-app-bar />

    <default-app-view />

    <default-app-fab />

    <default-app-snackbar />
  </v-app>
</template>

<script>

  export default {
    name: 'DefaultLayout',

    components: {
      DefaultAppDrawer: () => import('./AppDrawer'),
      DefaultAppBar: () => import('./AppBar'),
      DefaultAppView: () => import('./AppView'),
      DefaultAppFab: () => import('./AppFab'),
      DefaultAppSnackbar: () => import('./AppSnackbar'),
    },
  }
</script>
