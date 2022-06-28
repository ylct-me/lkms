<template>
  <v-list dense subheader>
    <v-subheader v-if="!mini" v-text="$t('my_teams')" />
    <v-divider v-else />
    <template v-for="(team, index) in teams">
      <v-list-item
        class="px-2"
        :to="`/teams/${team.id}/notes`"
        :key="index"
        @click="selectTeam(team)"
      >
        <v-list-item-avatar>
          <v-tooltip right>
            <template #activator="{ on, attrs }">
              <v-avatar
                :size="28"
                color="green lighten-1"
                class="white--text"
                v-bind="attrs"
                v-on="on"
                v-text="`${team.name[0]}`"
              />
            </template>
            <span v-text="team.name" />
          </v-tooltip>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title v-text="team.name" />
        </v-list-item-content>
      </v-list-item>
    </template>
    <!-- <v-divider />
    <v-list-item link>
      <v-list-item-action>
        <v-tooltip right>
          <template #activator="{ on, attrs }">
            <v-icon
              v-bind="attrs"
              v-on="on"
              @click="createTeam"
            >
              mdi-account-multiple-plus
            </v-icon>
          </template>
          <span v-text="$t('create_team')" />
        </v-tooltip>
      </v-list-item-action>
      <v-list-item-content class="mx-n2">
        <v-list-item-title>
          {{ $t('create_team') }}
        </v-list-item-title>
      </v-list-item-content>
    </v-list-item> -->
  </v-list>
</template>

<script>
import { get, sync, call } from "vuex-pathify";

export default {
  props: {
    mini: Boolean,
    teams: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    isAuthenticated: get("auth/isAuthenticated"),
    currentTeam: sync("team/current"),
    projectTreeItems: get("project/treeItems"),
  },
  methods: {
    ...call("project", ["getTeamProjects"]),
    async selectTeam(team) {
      this.currentTeam = team;
      if (this.isAuthenticated) {
        await this.getTeamProjects(team.id);
      }
    },
  },
};
</script>
