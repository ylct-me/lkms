<template>
  <v-navigation-drawer
    v-model="drawer"
    app
    :width="drawerWidth"
    color="grey lighten-3"
  >
    <v-navigation-drawer
      v-model="drawer"
      absolute
      :width="drawerWidth"
      :mini-variant="mini"
    >
      <profile-card :user="user" :mini="mini" />

      <v-divider />

      <perfect-scrollbar>
        <nav-list :items="computeMenu" :mini="mini" />

        <team-list v-if="isAuthenticated && matchAuthRequiredPage" :teams="teams" :mini="mini" />
      </perfect-scrollbar>



      <!-- <template v-slot:append>
        <div class="grey lighten-3">
          <template v-if="mini">
            <v-btn block width="56" height="48" icon tile class="mx-auto" @click="handleDrawerCollapse">
              <v-icon>mdi-arrow-collapse-right</v-icon>
            </v-btn>
          </template>
          <template v-else>
            <v-btn right block height="48" icon tile @click="handleDrawerCollapse">
              <v-icon>mdi-arrow-collapse-left</v-icon>
            </v-btn>
          </template>
        </div>
      </template> -->
    </v-navigation-drawer>
    <project-toolbar />
    <perfect-scrollbar>
      <project-tree />
    </perfect-scrollbar>
  </v-navigation-drawer>
</template>

<script>
// Utilities
import { get, sync } from "vuex-pathify";
import { protectedRoute as routes } from "@/router/config";
import { PerfectScrollbar } from "vue2-perfect-scrollbar";
import "vue2-perfect-scrollbar/dist/vue2-perfect-scrollbar.css";
import ProfileCard from "@/components/card/ProfileCard";
import NavList from "@/components/nav/NavList";
import TeamList from "@/components/team/TeamList";
import ProjectTree from "@/components/project/ProjectTree.vue";
import ProjectToolbar from "@/components/project/ProjectToolbar.vue";

export default {
  name: "DefaultAppDrawer",
  components: {
    PerfectScrollbar,
    ProfileCard,
    NavList,
    TeamList,
    ProjectTree,
    ProjectToolbar,
  },
  computed: {
    drawer: sync("app/drawer"),
    teams: get("team/myTeams"),
    ...get("auth", ["user", "isAuthenticated"]),
    computeMenu() {
      return this.filterRouteItem(routes[0].children);
    },
    mini() {
      return !this.$vuetify.breakpoint.mobile;
    },
    matchAuthRequiredPage() {
      return this.$route.meta.authRequired;
    },
  },
  data: () => ({
    drawerWidth: 300,
    items: [
      // TODO: 移到旁边的drawer
      // { text: '收藏笔记', icon: 'mdi-star' },
      // { text: '最近笔记', icon: 'mdi-history' },
    ],
    // teams: [
    //   { label: "Life", color: "cyan"},
    //   { label: "Technology", color: "green" },
    //   { label: "Accounting", color: "blue"},
    //   { label: "Eating", color: "red" },
    //   { label: "Cooking", color: "purple"},
    //   { label: "Gaming", color: "yellow" },
    //   { label: "Movie", color: "pink"},
    //   { label: "Reading", color: "orange" },
    //   { label: "Fucking", color: "blue"},
    //   { label: "Sport", color: "black"}
    // ],
    // projects: [
    //   {
    //     title: "some random title",
    //     order: 1,
    //     description: "Lorem, ipsum dolor sit amet"
    //   },
    //   {
    //     title: "some random title",
    //     order: 2,
    //     description: "Lorem, ipsum dolor sit amet"
    //   },
    // ],
  }),
  methods: {
    filterRouteItem(routes) {
      return routes
        .filter(
          (item) =>
            item.meta.hidden !== true &&
            item.meta.authRequired !== !this.isAuthenticated
        )
        .map((item) => {
          return {
            title: this.$t(item.meta.title),
            icon: item.meta.icon,
            path: item.path,
            children: item.children ? this.filterRouteItem(item.children) : [],
          };
        });
    },
    // handleDrawerCollapse() {
    //   this.mini = !this.mini
    // },
  },
};
</script>

<style lang="sass" scoped>
.ps
  max-height: calc(100vh - 56px - 10px)
</style>
