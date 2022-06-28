<template>
  <v-data-table
    :loading="loadingItems"
    :headers="headers"
    :items="allTeams"
    :search="search"
    calculate-widths
    class="elevation-1"
  >
    <template v-slot:top>
      <v-toolbar
        flat
      >
        <v-toolbar-title> {{ $t('teams') }} </v-toolbar-title>

        <v-spacer />
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          :label="$t('search_teams')"
          single-line
          hide-details
          clearable
          clear-icon="mdi-close"
        />
        <v-spacer />

        <v-dialog
          v-model="dialog"
          max-width="500px"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              color="primary"
              dark
              class="mb-2"
              v-bind="attrs"
              v-on="on"
            >
              {{ $t('create_team') }}
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="headline">{{ formTitle }}</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                  <v-col
                    cols="12"
                    md="6"
                  >
                    <v-text-field
                      v-model="editedItem.name"
                      outlined
                      :label="$t('dataTable.name')"
                    />
                  </v-col>
                  <v-col
                    cols="12"
                    md="6"
                  >
                    <v-text-field
                      v-model="editedItem.creator"
                      filled
                      disabled
                      readonly
                      :label="$t('dataTable.creator')"
                    />
                  </v-col>
                  <v-col
                    v-if="editedItem.members.length > 0"
                    cols="12"
                  >
                    <v-select
                      v-model="editedItem.members"
                      :items="initalMembers"
                      color="blue-grey lighten-2"
                      :label="$t('dataTable.members')"
                      item-text="name"
                      item-value="name"
                      dense
                      outlined
                      multiple
                      hide-details
                      return-object
                    >
                      <template v-slot:selection="data">
                        <v-chip
                          small
                          v-bind="data.attrs"
                          :input-value="data.selected"
                          close
                          @click="data.select"
                          @click:close="removeMembers(data.item)"
                        >
                          <v-avatar left>
                            <img v-if="data.item.avatar" :src="data.item.avatar" :alt="data.item.name">
                            <v-icon v-else size="32" color="indigo" dark>
                              mdi-account-circle
                            </v-icon>
                          </v-avatar>
                          {{ data.item.name }}
                        </v-chip>
                      </template>
                      <template v-slot:item="data">
                        <template>
                          <v-list-item-avatar>
                            <v-avatar left>
                              <img v-if="data.item.avatar" :src="data.item.avatar" :alt="data.item.name">
                              <v-icon v-else size="32" color="indigo" dark>
                                mdi-account-circle
                              </v-icon>
                            </v-avatar>
                          </v-list-item-avatar>
                          <v-list-item-content>
                            <v-list-item-title v-html="data.item.name"></v-list-item-title>
                          </v-list-item-content>
                        </template>
                      </template>
                    </v-select>
                  </v-col>
                  <v-col
                    cols="12"
                  >
                    <v-textarea
                      v-model="editedItem.description"
                      :label="$t('dataTable.description')"
                      outlined
                      auto-grow
                    />
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer />
              <v-btn
                color="blue darken-1"
                text
                @click="close"
                v-text="$t('cancel')"
              />
              <v-btn
                color="blue darken-1"
                text
                @click="save"
                v-text="$t('save')"
              />
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <template v-slot:item.actions="{ item }">
      <v-tooltip top v-if="item.creator === creator">
        <template #activator="{ on, attrs }">
          <v-btn
            small
            icon
            class="mr-2"
            v-bind="attrs"
            v-on="on"
            @click="handleEditTeam(item)"
          >
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
        </template>
        <span v-text="$t('dataTable.edit')" />
      </v-tooltip>

      <v-tooltip top v-if="item.creator === creator">
        <template #activator="{ on, attrs }">
          <v-btn
            small
            icon
            v-bind="attrs"
            v-on="on"
            @click="handleDeleteTeam(item)"
          >
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </template>
        <span v-text="$t('dataTable.delete')" />
      </v-tooltip>

      <v-tooltip top v-if="item.creator !== creator && !isTeamMember(item)">
        <template #activator="{ on, attrs }">
          <v-btn
            small
            icon
            v-bind="attrs"
            v-on="on"
            @click="joinTeam(item.id)"
          >
            <v-icon>mdi-account-plus</v-icon>
          </v-btn>
        </template>
        <span v-text="$t('dataTable.join')" />
      </v-tooltip>

      <v-tooltip top v-if="item.creator !== creator && isTeamMember(item)">
        <template #activator="{ on, attrs }">
          <v-btn
            small
            icon
            v-bind="attrs"
            v-on="on"
            @click="leaveTeam(item.id)"
          >
            <v-icon>mdi-account-minus</v-icon>
          </v-btn>
        </template>
        <span v-text="$t('dataTable.leave')" />
      </v-tooltip>
    </template>
  </v-data-table>
</template>

<script>
import { cloneDeep } from "lodash";
import { get, call } from "vuex-pathify";

export default {
  data: () => ({
    search: "",
    dialog: false,
    loadingItems: false,
    editedIndex: -1,
    editedItem: {
      name: "",
      description: "",
      creator: "",
      members: [],
    },
    defaultItem: {
      name: "",
      description: "",
      creator: "",
      members: [],
    },
    initalMembers: [],
  }),

  computed: {
    ...get("team", ["allTeams", "myTeams"]),
    ...get("auth", {
      creator: "user@name",
      isAuthenticated: "isAuthenticated",
    }),

    formTitle() {
      return this.editedIndex === -1
        ? this.$t("create_team")
        : this.$t("edit_team");
    },

    headers() {
      return [
        {
          text: "ID",
          align: "start",
          value: "id",
        },
        {
          text: this.$t("dataTable.name"),
          value: "name",
        },
        { text: this.$t("dataTable.description"), value: "description" },
        { text: this.$t("dataTable.creator"), value: "creator" },
        // {
        //   text: this.$t("dataTable.members"),
        //   value: "members",
        //   align: "center",
        //   width: 100,
        // },
        {
          text: this.$t("dataTable.actions"),
          value: "actions",
          align: "center",
          sortable: false,
        },
      ];
    },
  },

  watch: {
    $route: "initialize",
    dialog(val) {
      val || this.close();
    },
    // dialogDelete (val) {
    //   val || this.closeDelete()
    // },
  },
  async created() {
    await this.initialize();
  },
  methods: {
    getUserProfile: call("auth/getUserProfile"),
    ...call("team", [
      "getTeams",
      "getMyTeams",
      "createTeam",
      "editTeam",
      "deleteTeam",
      "joinTeam",
      "leaveTeam",
      "reserveTeamMembers",
    ]),
    async initialize() {
      this.loadingItems = true;
      this.defaultItem.creator = this.creator;
      await this.setDialogDefault();
      if (this.isAuthenticated) {
        await this.getMyTeams();
        await this.getTeams();
      }
      this.loadingItems = false;
    },
    filteredMembers(item) {
      return this.allTeams.find((team) => team.id === item.id).members;
    },
    isTeamMember(item) {
      return this.myTeams.some((team) => team.id === item.id);
    },
    removeMembers(item) {
      const index = this.initalMembers.indexOf(item);
      if (index >= 0) {
        this.editedItem.members.splice(index, 1);
      }
    },
    handleEditTeam(item) {
      this.editedIndex = this.allTeams.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.initalMembers = this.filteredMembers(item);
      this.editedItem.members = cloneDeep(this.initalMembers);
      this.dialog = true;
    },
    handleDeleteTeam(item) {
      this.loadingItems = true;
      this.editedIndex = this.allTeams.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.$confirm(this.$t("confirm_delete", [this.$t("team")]), {
        title: this.$t("warning"),
        buttonTrueText: this.$t("yes"),
        buttonFalseText: this.$t("no"),
      }).then(async (res) => {
        if (res) {
          await this.deleteTeam(item.id);
          // this.allTeams.splice(this.editedIndex, 1)
        }
        await this.setDialogDefault();
        this.loadingItems = false;
      });
    },

    async close() {
      this.dialog = false;
      await this.setDialogDefault();
    },

    async setDialogDefault() {
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    async save() {
      this.loadingItems = true;
      if (this.editedIndex > -1) {
        // Edit
        await this.editTeam({
          id: this.allTeams[this.editedIndex].id,
          name: this.editedItem.name,
          description: this.editedItem.description,
        }).catch(() => {});

        // Edit members
        if (this.editedItem.members.length !== this.initalMembers.length) {
          await this.reserveTeamMembers({
            id: this.allTeams[this.editedIndex].id,
            ids: this.editedItem.members.map((member) => member.id),
          }).catch(() => {});
        }
        // Object.assign(this.allTeams[this.editedIndex], this.editedItem)
      } else {
        // Add
        await this.createTeam({
          name: this.editedItem.name,
          description: this.editedItem.description,
        }).catch(() => {});
        // this.allTeams.push(this.editedItem)
      }
      this.loadingItems = false;
      await this.close();
    },
  },
};
</script>
