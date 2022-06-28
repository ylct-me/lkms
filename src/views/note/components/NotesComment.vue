<template>
  <v-container>
    <v-card>
      <v-toolbar
        dark color="primary"
      >
        <v-icon>mdi-comment</v-icon>
        <v-toolbar-title>评论区</v-toolbar-title>
      </v-toolbar>
      <v-list
        v-if="comments && comments.length > 0"
        dense
        two-line
      >
        <template v-for="(comment, index) in comments">
          <v-list-item :key="comment.id">
            <v-list-item-avatar>
              <v-icon large color="indigo">
                mdi-account-circle
              </v-icon>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title class="subtitle-1">
                {{ `#${index+1}  ${comment.reviewer} 评论于 ${comment.created_at}` }}
              </v-list-item-title>
              <v-divider class="my-2" />
              <v-list-item-subtitle class="body-1">
                {{ comment.content }}
              </v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action>
              <v-btn
                v-if="comment.reviewer === username"
                small
                rounded
                color="error"
                @click="deleteComment(comment)"
                v-text="$t('delete')"
              >
              </v-btn>
            </v-list-item-action>
          </v-list-item>
          <v-divider
            v-if="index !== comments.length - 1"
            :key="index"
          />
        </template>
      </v-list>
    </v-card>

    <v-card
      class="my-4"
      elevation="4"
    >
      <v-form
        ref="form"
        v-model="valid"
      >
        <v-textarea
          class="pa-2"
          v-model="currentComment.content"
          solo
          label="快来评论吧..."
          hide-details
          :rules="commentRules"
        />
      </v-form>
      <v-card-actions>
        <v-spacer />
        <v-btn
          :disabled="!valid"
          color="success"
          @click="submit"
          v-text="$t('comment')"
        />
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script>
import { get, sync, call } from "vuex-pathify";

export default {
  name: "NotesCommentComponent",
  props: {
    comments: {
      type: Array,
      default: () => [],
    },
  },
  data: () => ({
    valid: false,
  }),
  computed: {
    commentRules() {
      return [(v) => !!v || this.$t("rule.required", [this.$t("comment")])];
    },
    username: get("auth/user@name"),
    currentComment: sync("editor/comment"),
    currentNote: get("editor/note"),
  },
  methods: {
    ...call("editor", ["createNoteComment", "deleteNoteComment"]),
    submit() {
      if (this.$refs.form.validate()) {
        const newOrder = [...this.comments].pop()?.order || 0;
        this.createNoteComment({
          noteId: this.currentNote.id,
          comment: {
            ...this.currentComment,
            order: newOrder + 1,
          },
        });
        this.currentComment.content = "";
      }
    },
    deleteComment(comment) {
      this.deleteNoteComment({
        noteId: this.currentNote.id,
        commentId: comment.id,
      });
    },
  },
};
</script>
