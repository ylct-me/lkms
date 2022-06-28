<template>
  <v-toolbar class="pl-14" flat short>
    <v-toolbar-title class="subtitle-1">
      {{ $t('projects') }}
    </v-toolbar-title>
    <v-spacer />
    <v-tooltip right>
      <template #activator="{ on, attrs }">
        <v-btn icon v-bind="attrs" v-on="on" @click="isSearching = !isSearching">
          <v-icon>mdi-magnify</v-icon>
        </v-btn>
      </template>
      <span v-text="$t('search_projects_notes')" />
    </v-tooltip>
    <template #extension v-if="isSearching">
      <v-text-field
        v-model="teamSearch"
        autofocus
        prepend-inner-icon="mdi-magnify"
        clearable
        @keydown.esc="isSearching = false"
        :placeholder="$t('search_projects_notes')"
      />
    </template>

    <v-menu
      v-model="newProjectPopper"
      :close-on-content-click="false"
      :nudge-width="200"
      offset-y
    >
      <template v-slot:activator="{ on: menu, attrs }">
        <v-tooltip right>
          <template v-slot:activator="{ on: tooltip }">
            <v-btn
              icon
              v-bind="attrs"
              v-on="{ ...tooltip, ...menu }"
              :title="$t('create_project')"
            >
              <v-icon>mdi-folder-plus-outline</v-icon>
            </v-btn>
          </template>
          <span> {{ $t('create_project') }}</span>
        </v-tooltip>
      </template>
      <v-card>
        <v-card-text>
          <v-text-field
            :label="$t('project_name')"
            :placeholder="$t('project_name')"
            v-model="newProjectName"
            single-line
            hide-details
          />
        </v-card-text>
        <v-card-actions>
          <v-btn @click="newProjectPopper = false" depressed v-text="$t('cancel')" />
          <v-divider />
          <v-btn
            color="success"
            :disabled="!newProjectName"
            depressed
            @click="mkdir"
            v-text="$t('create_project')"
          />
        </v-card-actions>
      </v-card>
    </v-menu>
  </v-toolbar>
</template>

<script>
import { get, sync, call } from "vuex-pathify";

export default {
  name: "ProjectToolbar",
  computed: {
    teamSearch: sync("team/search"),
    isAuthenticated: get("auth/isAuthenticated"),
    currentTeam: get("team/current"),
    projectTreeItems: get("project/treeItems"),
  },
  data: () => ({
    isSearching: false,
    newProjectPopper: false,
    newProjectName: "",
  }),
  methods: {
    ...call("project", ["createMyProject", "createTeamProject"]),
    async mkdir() {
      if (this.isAuthenticated) {
        const newOrder = [...this.projectTreeItems].pop()?.order || 0;
        if (!this.$route.params.teamId) {
          await this.createMyProject({
            name: this.newProjectName,
            order: newOrder + 1,
          });
          // await this.getMyProjects();
        } else {
          const currentTeamId = this.currentTeam.id;
          await this.createTeamProject({
            teamId: currentTeamId,
            name: this.newProjectName,
            order: newOrder + 1,
          });
          // await this.getTeamProjects(currentTeamId);
        }

        this.newProjectPopper = false;
        this.newProjectName = "";
      }
    },
  },
};
</script>
