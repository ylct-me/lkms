import axios from "axios";

export default {
  getTeams() {
    return axios.get("/teams");
  },
  getMyTeams() {
    return axios.get("/teams/me");
  },
  createTeam(payload) {
    return axios.post("/teams", payload);
  },
  getTeam(id) {
    return axios.get(`/teams/${id}`);
  },
  updateTeam(id, payload) {
    return axios.patch(`/teams/${id}`, payload);
  },
  deleteTeam(id) {
    return axios.delete(`/teams/${id}`);
  },
  joinTeam(id) {
    return axios.post(`/teams/${id}/join`);
  },
  leaveTeam(id) {
    return axios.post(`/teams/${id}/leave`);
  },
  getTeamMembers(id) {
    return axios.get(`/teams/${id}/members`);
  },
  reserveTeamMembers(id, payload) {
    return axios.post(`/teams/${id}/members`, payload);
  }
};
