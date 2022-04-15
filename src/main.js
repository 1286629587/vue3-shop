import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import ElementPlus from './plugins/element'
// import locale from 'element-plus/es/locale'
// import zhCn from 'element-plus/es/locale/lang/zh-cn'
// import './plugins/element'
// 导入全局样式表
import './assets/css/global.css'
// import * as ElIconModules from '@element-plus/icons-vue'

import axios from 'axios'
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// 设置拦截器
axios.interceptors.request.use((config) => {
  // console.log(config)
  // 为请求头对象，添加 token 验证的 Authorization 字段
  config.headers.Authorization = window.sessionStorage.getItem('token')
  // 最后必须 return config
  return config
})
const app = createApp(App)
// app.prototype.$http = axios
app.config.globalProperties.$http = axios
app.use(ElementPlus)
// Object.keys(ElIconModules).forEach(function (key) {
//   app.component(ElIconModules[key].name, ElIconModules[key])
// })
app.use(router)
app.mount('#app')
