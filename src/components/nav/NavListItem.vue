<template>
  <v-list-item class="px-2" link :to="item.path">
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
    <v-list-item-content>
      <v-list-item-title v-text="item.title" />
    </v-list-item-content>
  </v-list-item>
</template>

<script>
export default {
  props: {
    item: Object,
  },
  computed: {},
}
</script>
