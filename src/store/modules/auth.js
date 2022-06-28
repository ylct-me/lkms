// Pathify
import { GUEST } from "@/constants/auth";
import authApi from "@/services/api/auth";
import profileApi from "@/services/api/profile";
import axios from "axios";
import { make } from "vuex-pathify";

// Data
const state = {
  user: GUEST,
  token: null
};

const mutations = {
  ...make.mutations(state),
  setLogout(state) {
    state.user = GUEST;
    state.token = null;
  }
};

const actions = {
  ...make.actions(state),
  login({ commit, dispatch }, { email, password }) {
    const formData = new FormData();
    formData.set("username", email);
    formData.set("password", password);

    return authApi.userLogin(formData).then(resp => {
      commit("token", resp.access_token);
      if (resp.access_token) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${this.token}`;
      }

      dispatch("getProfile");
      return resp;
    });
  },
  register({ dispatch }, { email, username, password }) {
    return authApi
      .userRegister({
        email,
        name: username,
        password
      })
      .then(resp => {
        // commit('user', resp)
        dispatch("login", {
          email,
          password
        });
        return resp;
      });
  },
  getProfile({ commit }) {
    return profileApi.getMyProfile().then(resp => {
      commit("user", resp);
      return resp;
    });
  },
  // getUserProfile({id}) {
  //   return profileApi.getUserProfile(id).then((resp) => {
  //     return resp
  //   })
  // },
  updateProfile({ commit }, { username, password, avatar }) {
    return profileApi
      .updateMyProfile({
        name: username,
        password,
        avatar
      })
      .then(resp => {
        commit("user", resp);
        return resp;
      });
  },
  logout({ commit }) {
    commit("setLogout");
    delete axios.defaults.headers.common["Authorization"];
  }
};

const getters = {
  user: state => state.user,
  token: state => state.token,
  isAuthenticated: state => !!state.token
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
