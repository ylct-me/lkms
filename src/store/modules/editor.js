// Pathify
import { NOTE } from "@/constants/editor";
import commentApi from "@/services/api/comment";
import noteApi from "@/services/api/note";
import profileApi from "@/services/api/profile";
import { formatDate } from "@/utils";
import { make } from "vuex-pathify";
// Data
const state = {
  note: NOTE,
  comment: {
    content: ""
  },
  isNewNote: true,
  comments: null
};

const mutations = make.mutations(state);

const actions = {
  ...make.actions(state),
  async filterCommentsList(_, comments) {
    const result = await Promise.all(
      comments.map(async item => {
        const reviewer = await profileApi.getUserProfile(item.reviewer_id);
        return {
          id: item.id,
          content: item.content,
          order: item.order,
          reviewer: reviewer.name,
          created_at: formatDate(item.created_at)
        };
      })
    );
    return result;
  },
  getComments({ commit, dispatch }, noteId) {
    return commentApi.getNoteComments(noteId).then(async resp => {
      commit("comments", await dispatch("filterCommentsList", resp));
      return resp;
    });
  },
  createNoteComment({ dispatch }, { noteId, comment }) {
    return commentApi.createNoteComment(noteId, comment).then(async resp => {
      await dispatch("getComments", noteId);
      return resp;
    });
  },
  deleteNoteComment({ dispatch }, { noteId, commentId }) {
    return commentApi.deleteNoteComment(noteId, commentId).then(async resp => {
      await dispatch("getComments", noteId);
      return resp;
    });
  },
  createProjectNote({ dispatch }, { teamId, project, note }) {
    const newOrder = [...project.children].pop()?.order || 0;
    if (project.projectType === "personal") {
      noteApi.createMyProjectNote(project.id, {
        ...note,
        order: newOrder + 1
      });
      dispatch("project/getMyProjects", null, { root: true });
    } else {
      noteApi.createTeamProjectNote(teamId, project.id, {
        ...note,
        order: newOrder + 1
      });
      dispatch("project/getTeamProjects", teamId, { root: true });
    }
  },
  editMyProjectNote(
    { dispatch },
    { projectId, noteId, title, content, order }
  ) {
    return noteApi
      .updateMyProjectNote(projectId, noteId, {
        title,
        content,
        order
      })
      .then(resp => {
        dispatch("project/getMyProjects", null, { root: true });
        return resp;
      });
  },
  editTeamProjectNote(
    { dispatch },
    { teamId, projectId, noteId, title, content, order }
  ) {
    return noteApi
      .updateTeamProjectNote(teamId, projectId, noteId, {
        title,
        content,
        order
      })
      .then(resp => {
        dispatch("project/getTeamProjects", teamId, { root: true });
        return resp;
      });
  },
  deleteMyProjectNote({ dispatch }, { projectId, noteId }) {
    return noteApi.deleteMyProjectNote(projectId, noteId).then(resp => {
      dispatch("project/getMyProjects", null, { root: true });
      return resp;
    });
  },
  deleteTeamProjectNote({ dispatch }, { teamId, projectId, noteId }) {
    return noteApi
      .deleteTeamProjectNote(teamId, projectId, noteId)
      .then(resp => {
        dispatch("project/getTeamProjects", teamId, { root: true });
        return resp;
      });
  },
  getTeamProjectNote(_, { teamId, projectId, noteId }) {
    return noteApi.getTeamProjectNote(teamId, projectId, noteId).then(resp => {
      return resp;
    });
  }
};

const getters = {
  note: state => state.note,
  isNewNote: state => state.isNewNote,
  comments: state => state.comments,
  comment: state => state.comment
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
