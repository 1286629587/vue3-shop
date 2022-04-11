import {
  ElButton,
  ElForm,
  ElFormItem,
  ElInput,
  ElMessage
} from 'element-plus'
// import lang from 'element-plus/lib/locale/lang/zh-cn'
// import locale from 'element-plus/lib/locale'
// import { Search } from '@element-plus/icons-vue'

export default (app) => {
  // locale.use(lang)
  app.use(ElButton)
  app.use(ElForm)
  app.use(ElFormItem)
  app.use(ElInput)
  // app.use(Search)
  app.use(ElMessage)
  app.config.globalProperties.$message = ElMessage
}
