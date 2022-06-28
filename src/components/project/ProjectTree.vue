<template>
  <v-treeview
    class="pl-14"
    :search="teamSearch"
    :active.sync="active"
    :open.sync="open"
    v-model="tree"
    :items="projectTreeItems"
    @update:open="openChanged"
    @update:active="activeChanged"
    item-key="id"
    item-text="title"
    dense
    activatable
    transition
    open-on-click
  >
    <template v-slot:prepend="{ item, open }">
      <v-icon v-if="item.type === 'project'">
        {{ open ? "mdi-folder-open" : "mdi-folder" }}
      </v-icon>
      <v-icon v-else>
        mdi-language-markdown
      </v-icon>
    </template>
    <!-- <template v-slot:label="{ item }">
      {{ item.title }}
    </template> -->
    <template v-slot:append="{ item }">
      <v-menu
        :close-on-content-click="false"
        offset-y
      >
        <template v-slot:activator="{ on: menu, attrs }">
          <v-tooltip top>
            <template #activator="{ on: tooltip }">
              <v-btn
                icon
                x-small
                v-bind="attrs"
                v-on="{ ...tooltip, ...menu }"
                @click.stop="showEditNoteMenu(item)"
              >
                <v-icon small color="grey darken-1">
                  mdi-pencil
                </v-icon>
              </v-btn>
            </template>
            <span v-text="$t('rename')" />
          </v-tooltip>
        </template>
        <v-card>
          <v-card-text>
            <v-text-field
              :label="$t('new_name')"
              :placeholder="$t('new_name')"
              v-model="newName"
              @keydown.enter="renameItem(item)"
              single-line
            />
          </v-card-text>
        </v-card>
      </v-menu>
      <v-menu
        :close-on-content-click="false"
        offset-y
      >
        <template v-slot:activator="{ on: menu, attrs }">
          <v-tooltip top>
            <template #activator="{ on: tooltip }">
              <v-btn
                icon
                x-small
                v-bind="attrs"
                v-on="{ ...tooltip, ...menu }"
                v-if="item.type === 'project'"
                @click.stop="showNewNoteMenu"
              >
                <v-icon small color="grey darken-1">
                  mdi-file-plus
                </v-icon>
              </v-btn>
            </template>
            <span v-text="$t('create_note')" />
          </v-tooltip>
        </template>
        <v-card>
          <v-card-text>
            <v-text-field
              :label="$t('new_note_name')"
              :placeholder="$t('new_note_name')"
              v-model="newNoteName"
              @keydown.enter="createNewNote(item)"
              single-line
            />
          </v-card-text>
        </v-card>
      </v-menu>
      <v-tooltip top>
        <template #activator="{ on, attrs }">
          <v-btn
            icon
            x-small
            v-bind="attrs"
            v-on="on"
            @click.stop="deleteItem(item)"
          >
            <v-icon small color="grey darken-1">
              mdi-delete
            </v-icon>
          </v-btn>
        </template>
        <span v-text="$t('delete')" />
      </v-tooltip>
    </template>
  </v-treeview>
</template>

<script>
import { NOTE } from "@/constants/editor";
import { get, sync, call } from "vuex-pathify";

export default {
  name: "ProjectTree",
  data: () => ({
    tree: [],
    newName: "",
    newNoteName: "",
  }),
  computed: {
    teamSearch: get("team/search"),
    ...sync("editor", {
      currentNote: "note",
      isNewNote: "isNewNote",
    }),
    ...sync("project", ["notes", "open", "active"]),
    currentProject: get("project/current"),
    projectTreeItems: get("project/treeItems"),
    currentTeam: get("team/current"),
  },
  methods: {
    ...call("project", [
      "editMyProject",
      "editTeamProject",
      "deleteMyProject",
      "deleteTeamProject",
    ]),
    ...call("editor", [
      "createProjectNote",
      "editMyProjectNote",
      "editTeamProjectNote",
      "deleteMyProjectNote",
      "deleteTeamProjectNote",
    ]),
    showEditNoteMenu(item) {
      this.newName = item.title;
    },
    showNewNoteMenu() {
      this.newNoteName = "";
    },

    openChanged() {
      // console.log(this.open);
    },
    activeChanged() {
      if (!this.active.length) return;

      const noteId = this.active[0];

      if (noteId === this.currentNote.id) return;

      const teamId = this.$route.params.teamId;

      if (!teamId) {
        this.$router.push({ name: "Note", params: { noteId } });
      } else {
        this.$router.push({ name: "TeamNote", params: { teamId, noteId } });
      }

      // const note = this.notes.find((note) => note.id === noteId);
      // console.log(note);
      // if (note) {
      //   this.currentNote = note;
      //   this.isNewNote = false;
      // }
    },
    createNewNote(item) {
      this.createProjectNote({
        teamId: this.currentTeam.id,
        project: item,
        note: {
          title: this.newNoteName,
          content: "",
        },
      });
      this.newNoteName = "";
    },
    deleteItem(item) {
      if (item.type === "project") {
        if (item.projectType === "personal") {
          this.deleteMyProject(item.id);
        } else {
          this.deleteTeamProject({
            teamId: this.currentTeam?.id,
            projectId: item.id,
          });
        }
      } else {
        if (item.projectType === "personal") {
          this.deleteMyProjectNote({
            projectId: item.project_id,
            noteId: item.id,
          });
        } else {
          this.deleteTeamProjectNote({
            teamId: this.currentTeam?.id,
            projectId: item.project_id,
            noteId: item.id,
          });
        }
        if (+this.active[0] === this.currentNote.id) {
          if (item.projectType === "personal") {
            this.$router.push({ name: "Notes" });
          } else {
            this.$router.push({
              name: "TeamNotes",
              params: { teamId: this.currentTeam?.id },
            });
          }

          this.active = [];
          this.currentNote = NOTE;
          this.isNewNote = true;
        }
      }
    },
    renameItem(item) {
      if (item.type === "project") {
        if (item.projectType === "personal") {
          this.editMyProject({
            id: item.id,
            name: this.newName,
          });
        } else {
          this.editTeamProject({
            teamId: this.currentTeam?.id,
            projectId: item.id,
            name: this.newName,
          });
        }
      } else {
        if (item.projectType === "personal") {
          this.editMyProjectNote({
            projectId: item.project_id,
            noteId: item.id,
            title: this.newName,
          });
        } else {
          this.editTeamProjectNote({
            teamId: this.currentTeam?.id,
            projectId: item.project_id,
            noteId: item.id,
            title: this.newName,
          });
        }
      }
    },
  },
};
</script>


