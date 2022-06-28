<template>
  <v-card outlined>
    <notes-editor :note="currentNote" :is-new-note="isNewNote" :mode="editorMode" />

    <v-divider v-show="!isNewNote && $route.params.teamId" class="mt-6" />

    <notes-comment v-if="!isNewNote && $route.params.teamId" :comments="comments" />
  </v-card>
</template>

<script>
import { NOTE } from "@/constants/editor";
import { get, sync, call } from "vuex-pathify";

export default {
  components: {
    NotesEditor: () => import("./components/NotesEditor"),
    NotesComment: () => import("./components/NotesComment"),
  },
  async created() {
    await this.initialize();
  },
  data: () => ({
    editorMode: "editable",
  }),
  computed: {
    isAuthenticated: get("auth/isAuthenticated"),
    notes: get("project/notes"),
    ...sync("project", ["open", "active"]),
    ...sync("editor", {
      currentNote: "note",
      comments: "comments",
    }),
    isNewNote: sync("editor/isNewNote"),
    teams: get("team/myTeams"),
    currentTeam: sync("team/current"),
  },
  watch: {
    $route: "initialize",
  },
  methods: {
    ...call("project", ["getMyProjects", "getTeamProjects"]),
    ...call("team", ["getMyTeams"]),
    ...call("editor", ["getComments", "getTeamProjectNote"]),
    async initialize() {
      const teamId = this.$route.params.teamId;
      const noteId = this.$route.params.noteId;
      if (this.isAuthenticated) {
        if (teamId && this.currentTeam.id !== +teamId) {
          await this.getMyTeams();
        }
        const team = this.teams.find((team) => team.id === +teamId);
        if (this.currentTeam.id !== +teamId) {
          if (team) {
            await this.getTeamProjects(team.id);
            this.currentTeam = team;
          }
        }
        if (!teamId && !noteId) {
          await this.getMyProjects();
        }

        if (noteId) {
          const note = this.notes.find((note) => note.id === +noteId);
          if (note) {
            if (team) {
              await this.getTeamProjectNote({
                teamId,
                projectId: note.project_id,
                noteId: note.id,
              })
                .then(() => {
                  this.editorMode = "editable";
                })
                .catch((err) => {
                  const {
                    data: { detail },
                  } = err.response;
                  if (detail === "NOTE_IS_EDITING") {
                    this.editorMode = "preview";
                  }
                });
            }
            this.currentNote = note;
            await this.getComments(note.id);
            this.isNewNote = false;
          } else {
            // 回到上一层路由
            if (team) {
              this.$router.push({ name: "TeamNotes" });
            } else {
              this.$router.push({ name: "Notes" });
            }
            this.currentNote = NOTE;
            this.isNewNote = true;
          }
        } else {
          this.active = [];
          this.currentNote = NOTE;
          this.isNewNote = true;
        }
      }
    },
  },
};
</script>
