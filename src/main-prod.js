import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
// import ElementPlus from './plugins/element'
import { QuillEditor } from '@vueup/vue-quill/'
// import '@vueup/vue-quill/dist/vue-quill.snow.css'
import NProgress from 'nprogress'
// import 'nprogress/nprogress.css'
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
  // 显示进度条
  NProgress.start()
  // console.log(config)
  // 为请求头对象，添加 token 验证的 Authorization 字段
  config.headers.Authorization = window.sessionStorage.getItem('token')
  // 最后必须 return config
  return config
})
axios.interceptors.response.use((config) => {
  // 隐藏进度条
  NProgress.done()
  return config
})
const app = createApp(App)
// app.prototype.$http = axios
app.config.globalProperties.$http = axios
app.config.globalProperties.$filters = {
  format (originVal) {
    const dt = new Date(originVal)
    const dty = dt.getFullYear()
    const dtm = (dt.getMonth() + 1 + '').padStart(2, '0')
    const dtd = (dt.getDate() + '').padStart(2, '0')
    const hh = (dt.getHours() + '').padStart(2, '0')
    const mm = (dt.getMinutes() + '').padStart(2, '0')
    const ss = (dt.getSeconds() + '').padStart(2, '0')
    return `${dty}-${dtm}-${dtd} ${hh}:${mm}:${ss}`
  }
}
app.component('QuillEditor', QuillEditor)
// app.use(ElementPlus)
app.use(router)
app.mount('#app')
