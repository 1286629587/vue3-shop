import {
  ElButton,
  ElForm,
  ElFormItem,
  ElInput,
  ElMessage,
  ElContainer,
  ElHeader,
  ElAside,
  ElMain,
  ElIcon,
  ElMenu,
  ElMenuItem,
  ElSubmenu,
  ElBreadcrumb,
  ElBreadcrumbItem,
  ElCard,
  ElRow,
  ElCol,
  ElTable,
  ElTableColumn,
  ElSwitch,
  ElTooltip,
  ElPagination,
  ElDialog,
  ElMessageBox,
  ElTag,
  ElTree,
  ElSelect,
  ElOption,
  ElCascader
} from 'element-plus'
// import lang from 'element-plus/es/locale/lang/zh-cn'
// import locale from 'element-plus/es/locale'
// import { Search } from '@element-plus/icons-vue'

export default (app) => {
  app.use(ElButton)
  app.use(ElForm)
  app.use(ElFormItem)
  app.use(ElInput)
  // app.use(Search)
  app.use(ElMessage)
  app.use(ElContainer)
  app.use(ElHeader)
  app.use(ElAside)
  app.use(ElMain)
  app.use(ElIcon)
  app.use(ElMenu)
  app.use(ElMenuItem)
  app.use(ElSubmenu)
  app.use(ElBreadcrumb)
  app.use(ElBreadcrumbItem)
  app.use(ElCard)
  app.use(ElRow)
  app.use(ElCol)
  app.use(ElTable)
  app.use(ElTableColumn)
  app.use(ElSwitch)
  app.use(ElTooltip)
  app.use(ElPagination)
  app.use(ElDialog)
  app.use(ElTag)
  app.use(ElTree)
  app.use(ElSelect)
  app.use(ElOption)
  app.use(ElCascader)
  app.config.globalProperties.$message = ElMessage
  app.config.globalProperties.$confirm = ElMessageBox.confirm
}
