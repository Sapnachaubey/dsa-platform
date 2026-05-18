import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true,
})

export const authApi = {
  register: (payload) => api.post('/auth/register', payload).then((res) => res.data),
  login: (payload) => api.post('/auth/login', payload).then((res) => res.data),
  logout: () => api.post('/auth/logout').then((res) => res.data),
  me: () => api.get('/auth/me').then((res) => res.data),
}

export const sheetApi = {
  getTopics: () => api.get('/topics?includeProblems=true').then((res) => res.data),
  getDashboard: () => api.get('/dashboard').then((res) => res.data),
  updateProgress: (problemId, completed) =>
    api.put(`/progress/${problemId}`, { completed }).then((res) => res.data),
}

export const getApiError = (error) => {
  return error.response?.data?.message || error.message || 'Something went wrong'
}

export default api
