<template>
  <v-toolbar-items>
    <v-icon>mdi-home</v-icon>
    <v-breadcrumbs
      class="pa-3"
      :items="breadcrumbs"
    />
    <!-- <v-spacer></v-spacer>
      <v-btn icon small color="black">
      <v-icon @click="handleGoBack" v-text="'mdi-arrow-left'" />
      </v-btn> -->
  </v-toolbar-items>
</template>

<script>
import { get } from "vuex-pathify";
export default {
  name: "DefaultAppToolbar",
  computed: {
    currentTeam: get("team/current"),
    breadcrumbs() {
      const { matched } = this.$route;
      const matchedRoutes = matched.map((route, index) => {
        const to =
          index === matched.length - 1
            ? this.$route.path
            : route.path || route.redirect;
        const text = this.$t(route.meta.title);
        return {
          text: text,
          to: to,
          exact: true,
          disabled: false,
        };
      });
      if (this.$route.params.teamId) {
        matchedRoutes.push({
          text: this.currentTeam.name,
          disabled: true,
        });
      }

      return matchedRoutes;
    },
  },
  // methods: {
  //   handleGoBack() {
  //     this.$router.go(-1)
  //   },
  // }
};
</script>
