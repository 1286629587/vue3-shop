import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import installElementPlus from './plugins/element'
// import './plugins/element'
// 导入全局样式表
import './assets/css/global.css'
// import * as ElIconModules from '@element-plus/icons-vue'

import axios from 'axios'
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
const app = createApp(App)
// app.prototype.$http = axios
app.config.globalProperties.$http = axios
app.use(installElementPlus)
// Object.keys(ElIconModules).forEach(function (key) {
//   app.component(ElIconModules[key].name, ElIconModules[key])
// })
app.use(router)
app.mount('#app')
