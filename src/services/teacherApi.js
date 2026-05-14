import axios from 'axios'

const teacherApi = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
})

teacherApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('teacherToken')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export default teacherApi