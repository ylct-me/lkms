// Pathify
import noteApi from "@/services/api/note";
import projectApi from "@/services/api/project";
import { make } from "vuex-pathify";

// Data
const state = {
  current: null,
  rawTreeItems: [],
  treeItems: [],
  menuItems: [],
  notes: [],
  open: [],
  active: []
};

const mutations = {
  ...make.mutations(state)
};

const actions = {
  ...make.actions(state),
  async getProjectTreeItems({ commit, dispatch }, { teamId, items }) {
    const notesList = [];
    const result = await Promise.all(
      await items.map(async item => {
        let notes = null;
        let projectType = "personal";
        if (teamId) {
          notes = await noteApi.getTeamProjectNotes(teamId, item.id);
          projectType = "team";
        } else {
          notes = await noteApi.getMyProjectNotes(item.id);
        }
        const newNotes = notes.map(item => {
          return {
            ...item,
            projectType
          };
        });
        notesList.push(...newNotes);

        return {
          id: item.id,
          type: "project",
          projectType,
          title: item.name,
          order: item.order,
          children: newNotes
        };
      })
    );

    commit("notes", notesList);
    commit("treeItems", result);
    dispatch("getProjectMenuItems", {
      teamId: teamId ?? null,
      items: result
    });
  },
  getProjectMenuItems({ commit, dispatch, rootGetters }, { teamId, items }) {
    const menuItems = items.map(item => {
      return {
        name: item.id,
        text: item.title,
        action: () => {
          dispatch(
            "editor/createProjectNote",
            {
              teamId,
              project: item,
              note: rootGetters["editor/note"]
            },
            { root: true }
          );
          dispatch(
            "snackbar/showSnackbar",
            {
              color: "success",
              text: "save_note_successful"
            },
            { root: true }
          );
        }
      };
    });

    commit("menuItems", menuItems);
  },
  getMyProjects({ commit, dispatch }) {
    return projectApi.getMyProjects().then(async resp => {
      commit("rawTreeItems", resp);

      await dispatch("getProjectTreeItems", {
        teamId: null,
        items: resp
      });
      return resp;
    });
  },
  getTeamProjects({ commit, dispatch }, teamId) {
    return projectApi.getTeamProjects(teamId).then(async resp => {
      commit("rawTreeItems", resp);

      await dispatch("getProjectTreeItems", {
        teamId,
        items: resp
      });
      return resp;
    });
  },
  createMyProject({ commit, dispatch }, { name, order }) {
    return projectApi
      .createMyProject({
        name,
        order
      })
      .then(async resp => {
        commit("current", resp[0]);
        dispatch("getMyProjects");
        return resp;
      });
  },
  createTeamProject({ commit, dispatch }, { teamId, name, order }) {
    return projectApi
      .createTeamProject(teamId, {
        name,
        order
      })
      .then(async resp => {
        commit("current", resp[0]);
        dispatch("getTeamProjects", teamId);
        return resp;
      });
  },
  editMyProject({ dispatch }, { id, name, order }) {
    return projectApi
      .updateMyProject(id, {
        name,
        order
      })
      .then(resp => {
        dispatch("getMyProjects");
        return resp;
      });
  },
  editTeamProject({ dispatch }, { teamId, projectId, name, order }) {
    return projectApi
      .updateTeamProject(teamId, projectId, {
        name,
        order
      })
      .then(resp => {
        dispatch("getTeamProjects", teamId);
        return resp;
      });
  },
  deleteMyProject({ dispatch }, id) {
    return projectApi.deleteMyProject(id).then(resp => {
      dispatch("getMyProjects");
      return resp;
    });
  },
  deleteTeamProject({ dispatch }, { teamId, projectId }) {
    return projectApi.deleteTeamProject(teamId, projectId).then(resp => {
      dispatch("getTeamProjects", teamId);
      return resp;
    });
  }
};

const getters = {
  current: state => state.current,
  treeItems: state => state.treeItems,
  menuItems: state => state.menuItems,
  notes: state => state.notes,
  open: state => state.open,
  active: state => state.active
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
