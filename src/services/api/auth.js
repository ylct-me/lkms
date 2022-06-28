import axios from 'axios'

export default {
  userLogin(payload) {
    return axios.post('/auth/jwt/login', payload)
  },
  userRegister(payload) {
    return axios.post('/auth/register', payload)
  },
}
