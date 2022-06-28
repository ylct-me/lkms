// Pathify
import profileApi from "@/services/api/profile";
import teamApi from "@/services/api/team";
import { make } from "vuex-pathify";

// Data
const state = {
  current: {
    name: ""
  },
  search: "",
  allTeams: [],
  displayList: [],
  myTeams: []
};

const mutations = make.mutations(state);

const actions = {
  ...make.actions(state),
  async filterTeamsList({ dispatch }, teams) {
    const result = await Promise.all(
      teams.map(async item => {
        const creator = await profileApi.getUserProfile(item.creator_id);
        return {
          id: item.id,
          name: item.name,
          description: item.description,
          creator: creator.name,
          members: await dispatch("getTeamMembers", item.id)
        };
      })
    );
    return result;
  },
  getTeams({ commit, dispatch }) {
    return teamApi.getTeams().then(async resp => {
      commit("allTeams", await dispatch("filterTeamsList", resp));
      return resp;
    });
  },
  getMyTeams({ commit }) {
    return teamApi.getMyTeams().then(resp => {
      commit("myTeams", resp);
      return resp;
    });
  },
  createTeam({ dispatch }, { name, description }) {
    return teamApi
      .createTeam({
        name,
        description
      })
      .then(resp => {
        dispatch("getMyTeams");
        dispatch("getTeams");
        return resp;
      });
  },
  editTeam({ dispatch }, { id, name, description }) {
    return teamApi
      .updateTeam(id, {
        name,
        description
      })
      .then(resp => {
        dispatch("getMyTeams");
        dispatch("getTeams");
        return resp;
      });
  },
  deleteTeam({ dispatch }, id) {
    return teamApi.deleteTeam(id).then(resp => {
      dispatch("getMyTeams");
      dispatch("getTeams");
      return resp;
    });
  },
  joinTeam({ dispatch }, id) {
    return teamApi.joinTeam(id).then(resp => {
      dispatch("getMyTeams");
      return resp;
    });
  },
  leaveTeam({ dispatch }, id) {
    return teamApi.leaveTeam(id).then(resp => {
      dispatch("getMyTeams");
      return resp;
    });
  },
  getTeamMembers(_, id) {
    return teamApi.getTeamMembers(id).then(resp => {
      return resp;
    });
  },
  reserveTeamMembers({ dispatch }, { id, ids }) {
    return teamApi
      .reserveTeamMembers(id, {
        ids
      })
      .then(resp => {
        dispatch("getTeams");
        return resp;
      });
  }
};

const getters = {
  current: state => state.current,
  allTeams: state => state.allTeams,
  displayList: state => state.displayList,
  myTeams: state => state.myTeams,
  search: state => state.search
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
