<template>
  <v-list dense subheader>
    <template v-for="(item, key) in items">
      <v-list-group
        v-if="hasChild(item) && !mini"
        :key="key"
        :prepend-icon="item.icon"
        no-action
        :to="item.path"
        :value="computeGroupExpanded(item, $route)"
      >
        <!-- <template #prependIcon>
          <v-list-item-avatar>
            <v-tooltip right>
              <template #activator="{ on, attrs }">
                <v-avatar>
                  <v-icon :size="28" v-bind="attrs" v-on="on" v-text="item.icon" />
                </v-avatar>
              </template>
              <span v-text="item.title" />
            </v-tooltip>
          </v-list-item-avatar>
        </template> -->
        <template #activator>
          <v-list-item-content class="mx-n2">
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </template>
        <nav-list-item class="mx-4" v-for="child in item.children" v-show="!mini" :key="'c' + child.path" :item="child" />
      </v-list-group>
      <nav-list-item v-else :key="'nav' + key" :item="item" />
    </template>
  </v-list>
</template>

<script>
import NavListItem from "./NavListItem.vue";
export default {
  components: {
    NavListItem,
  },
  props: {
    mini: Boolean,
    items: {
      type: Array,
      default: () => [],
    },
  },
  methods: {
    hasChild(item) {
      return Array.isArray(item.children) && item.children.length > 0;
    },
    computeGroupExpanded(item, $route) {
      return $route.matched.map((item) => item.path).includes(item.path);
    },
  },
};
</script>
