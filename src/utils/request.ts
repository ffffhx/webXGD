import axios, { type AxiosResponse, type InternalAxiosRequestConfig } from 'axios'
const service = axios.create({
  baseURL: 'http://39.103.98.47:8089/',
  timeout: 5000,
})
// 请求拦截器
service.interceptors.request.use(
  // config 包含请求的url、参数、超时时间等
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token')
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
      console.log(`[Request] ${config.method?.toUpperCase()} ${config.url}`)
    }
    return config
  },
  (error) => {
    console.error('[Request Error]', error)
    return Promise.reject(error)
  },
)
service.interceptors.response.use(
  (response: AxiosResponse) => {
    const res = response.data
    console.log(res, 'res')
    return res
  },
  (error) => {
    const status = error.response?.status
    if (status) {
      switch (status) {
        case 401:
          console.warn('未授权，跳转登录')
          // 这里可以触发登出或跳转登录页
          break
        case 403:
          console.warn('权限不足')
          break
        case 500:
          console.error('服务器错误')
          break
        default:
          console.error(`HTTP错误：${status}`)
      }
    } else {
      console.error('网络连接错误')
    }
    return Promise.reject(error)
  },
)
export default service
