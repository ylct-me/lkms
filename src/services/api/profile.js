import axios from 'axios'

export default {
  getMyProfile() {
    return axios.get('/users/me')
  },
  updateMyProfile(payload) {
    return axios.patch('/users/me', payload)
  },
  getUserProfile(id) {
    return axios.get(`/users/${id}`)
  },
}
