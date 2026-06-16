import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
})

// ========== 用户 ==========
export const login = (login_name, password) =>
  api.post('/user/login', { login_name, password })

export const register = (reg_name, password, nickname) =>
  api.post('/user/register', { reg_name, password, nickname })

export const getUserInfo = () =>
  api.get('/user/info')

export const updateUserInfo = (data) =>
  api.put('/user/info', data)

export const updatePassword = (oldPassword, newPassword) =>
  api.put('/user/password', { oldPassword, newPassword })

// ========== 目的地 ==========
export const getDestinations = () =>
  api.get('/destinations')

export const createDestination = (data) =>
  api.post('/destinations', data)

export const updateDestination = (id, data) =>
  api.put(`/destinations/${id}`, data)

export const deleteDestination = (id) =>
  api.delete(`/destinations/${id}`)

// ========== 标签 ==========
export const getTags = () =>
  api.get('/tags')

export const createTag = (name) =>
  api.post('/tags', { name })

export const deleteTag = (id) =>
  api.delete(`/tags/${id}`)

export default api