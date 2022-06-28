import axios from 'axios'

export default {
  getMyNotes() {
    return axios.get('/notes/me')
  },
  getMyProjectNotes(projectId) {
    return axios.get(`/notes/me/${projectId}`)
  },
  createMyProjectNote(projectId, payload) {
    return axios.post(`/notes/me/${projectId}`, payload)
  },
  getMyProjectNote(projectId, noteId) {
    return axios.get(`/notes/me/${projectId}/${noteId}`)
  },
  updateMyProjectNote(projectId, noteId, payload) {
    return axios.patch(`/notes/me/${projectId}/${noteId}`, payload)
  },
  deleteMyProjectNote(projectId, noteId) {
    return axios.delete(`/notes/me/${projectId}/${noteId}`)
  },
  //
  getTeamNotes(teamId) {
    return axios.get(`/notes/team/${teamId}`)
  },
  getTeamProjectNotes(teamId, projectId) {
    return axios.get(`/notes/team/${teamId}/${projectId}`)
  },
  createTeamProjectNote(teamId, projectId, payload) {
    return axios.post(`/notes/team/${teamId}/${projectId}`, payload)
  },
  getTeamProjectNote(teamId, projectId, noteId) {
    return axios.get(`/notes/team/${teamId}/${projectId}/${noteId}`)
  },
  updateTeamProjectNote(teamId, projectId, noteId, payload) {
    return axios.patch(`/notes/team/${teamId}/${projectId}/${noteId}`, payload)
  },
  deleteTeamProjectNote(teamId, projectId, noteId) {
    return axios.delete(`/notes/team/${teamId}/${projectId}/${noteId}`)
  },
}
