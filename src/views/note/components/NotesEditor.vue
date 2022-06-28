<template>
  <v-md-editor
    v-model="note.content"
    :key="editorKey"
    :height="height"
    :toolbar="toolbar"
    :left-toolbar="leftToolbar"
    @save="saveNote"
    @change="changeNote"
    :mode="mode"
  />
</template>

<script>
import VMdEditor from "@kangc/v-md-editor";

import zhCN from "@kangc/v-md-editor/lib/lang/zh-CN";
import enUS from "@kangc/v-md-editor/lib/lang/en-US";

import { get, call } from "vuex-pathify";

export default {
  name: "NotesEditorComponent",
  props: {
    note: Object,
    isNewNote: Boolean,
    mode: {
      type: String,
      default: () => "editable",
    },
  },
  data: () => ({
    editorKey: 0,
  }),
  computed: {
    // currentNote: sync("editor/note"),
    isAuthenticated: get("auth/isAuthenticated"),
    projectMenuItems: get("project/menuItems"),
    currentTeam: get("team/current"),
    locale: get("app/locale"),
    height() {
      // switch (this.$vuetify.breakpoint.name) {
      //   case 'xs': return "550px"
      //   case 'sm': return "600px"
      //   case 'md': return "600px"
      //   case 'lg': return "600px"
      //   case 'xl': return "600px"
      // }
      return "600px";
    },
    hasProjects() {
      return this.projectMenuItems.length > 0;
    },
    toolbar() {
      return {
        saveNoteToProject: {
          title: "保存笔记到项目",
          icon: "v-md-icon-save",
          menus: this.projectMenuItems,
        },
      };
    },
    leftToolbar() {
      if (this.isNewNote && this.hasProjects) {
        return "undo redo clear | link image code | emoji | saveNoteToProject";
      }
      return "undo redo clear | link image code | emoji | save";
    },
  },
  watch: {
    projectMenuItems() {
      this.editorKey += 1;
    },
    locale(newValue) {
      switch (newValue) {
        case "en":
          VMdEditor.lang.use("en-US", enUS);
          break;
        case "zh":
          VMdEditor.lang.use("zh-CN", zhCN);
          break;
        default:
          break;
      }
    },
  },
  methods: {
    showSnackbar: call("snackbar/showSnackbar"),
    ...call("editor", ["editMyProjectNote", "editTeamProjectNote"]),
    changeNote(text) {
      const firstLine = text.trim().split("\n")[0];
      if (firstLine.substring(0, 2) === "# ") {
        const title = firstLine.substring(2);
        this.note.title = title;
      }
    },
    async saveNote(text) {
      if (!text.length) return;
      const currentNote = this.note;
      if (this.isAuthenticated) {
        if (currentNote.projectType === "personal") {
          await this.editMyProjectNote({
            projectId: currentNote.project_id,
            noteId: currentNote.id,
            title: currentNote.title,
            content: currentNote.content,
            order: currentNote.order,
          });
        } else {
          await this.editTeamProjectNote({
            teamId: this.currentTeam.id,
            projectId: currentNote.project_id,
            noteId: currentNote.id,
            title: currentNote.title,
            content: currentNote.content,
            order: currentNote.order,
          });
        }
        await this.showSnackbar({
          color: "success",
          text: "save_note_successful",
        });
      }
    },
  },
};
</script>
