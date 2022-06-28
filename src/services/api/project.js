import axios from "axios";

export default {
  getMyProjects() {
    return axios.get("/projects/me");
  },
  createMyProject(payload) {
    return axios.post("/projects/me", payload);
  },
  getMyProject(id) {
    return axios.get(`/projects/me/${id}`);
  },
  updateMyProject(id, payload) {
    return axios.patch(`/projects/me/${id}`, payload);
  },
  deleteMyProject(id) {
    return axios.delete(`/projects/me/${id}`);
  },
  getTeamProjects(teamId) {
    return axios.get(`/projects/team/${teamId}`);
  },
  createTeamProject(teamId, payload) {
    return axios.post(`/projects/team/${teamId}`, payload);
  },
  getTeamProject(teamId, projectId) {
    return axios.get(`/projects/team/${teamId}/${projectId}`);
  },
  updateTeamProject(teamId, projectId, payload) {
    return axios.patch(`/projects/team/${teamId}/${projectId}`, payload);
  },
  deleteTeamProject(teamId, projectId) {
    return axios.delete(`/projects/team/${teamId}/${projectId}`);
  }
};
