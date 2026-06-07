import axios from 'axios'

const request = axios.create({
  baseURL: 'http://localhost:8080/wardrobe_back',
  timeout: 5000
})

request.interceptors.request.use(config => {
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  if (user.token) {
    config.headers.token = user.token
  }

  return config
})

export default request