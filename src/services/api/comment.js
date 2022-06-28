import axios from 'axios'

export default {
  getNoteComments(noteId) {
    return axios.get(`/comments/${noteId}`)
  },
  createNoteComment(noteId, payload) {
    return axios.post(`/comments/${noteId}`, payload)
  },
  getNoteComment(noteId, commentId) {
    return axios.get(`/comments/${noteId}/${commentId}`)
  },
  updateNoteComment(noteId, commentId, payload) {
    return axios.patch(`/comments/${noteId}/${commentId}`, payload)
  },
  deleteNoteComment(noteId, commentId) {
    return axios.delete(`/comments/${noteId}/${commentId}`)
  },
}
