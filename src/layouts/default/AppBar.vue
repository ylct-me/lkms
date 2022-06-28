<template>
  <v-app-bar
    app
    dense
    color="blue-grey lighten-2"
    dark
  >
    <v-app-bar-nav-icon
      @click="drawer = !drawer"
    />

    <v-toolbar-title>
      {{ currentTitle }}
    </v-toolbar-title>

    <v-spacer />

    <!-- <v-btn icon>
      <v-icon>mdi-heart</v-icon>
    </v-btn>

    <v-menu
      left
      bottom
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          icon
          v-bind="attrs"
          v-on="on"
        >
          <v-icon>mdi-dots-vertical</v-icon>
        </v-btn>
      </template>

      <v-list>
        <v-list-item
          v-for="n in 5"
          :key="n"
          @click="() => {}"
        >
          <v-list-item-title>Option {{ n }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu> -->

    <locale-switch />

    <template v-slot:extension>
      <default-app-toolbar />
    </template>
  </v-app-bar>
</template>

<script>
import LocaleSwitch from "@/components/locale/LocaleSwitch";

import { get, sync } from "vuex-pathify";

export default {
  name: "DefaultAppBar",
  components: {
    LocaleSwitch,
    DefaultAppToolbar: () => import("./AppToolbar"),
  },
  computed: {
    drawer: sync("app/drawer"),
    currentProjectName: get("project/current@name"),
    currentNoteName: get("editor/note@title"),
    currentTitle() {
      if (this.currentProjectName?.length > 0) {
        return `${this.currentProjectName} -> ${this.currentNoteName}`;
      }
      return this.currentNoteName;
    },
  },
};
</script>
