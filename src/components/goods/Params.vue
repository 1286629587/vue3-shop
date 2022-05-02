<template>
  <!-- 面包屑导航区 -->
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>商品管理</el-breadcrumb-item>
    <el-breadcrumb-item>参数列表</el-breadcrumb-item>
  </el-breadcrumb>
  <!-- 卡片视图区 -->
  <el-card>
    <el-alert
      title="注意：只允许为第三级分类设置相关参数"
      type="warning"
      :closable="false"
      show-icon
    />
    <el-row class="margin-top">
      <el-col>
        <span>选择商品分类：</span>
        <el-cascader
          v-model="list.SelectedKeys"
          :options="list.CateList"
          :props="Props"
          @change="handleChange"
          clearable
        />
      </el-col>
    </el-row>
    <!-- 标签页 -->
    <el-tabs v-model="activeName" @tab-click="handleTabClick">
      <el-tab-pane label="动态参数" name="many">
        <el-button
          type="primary"
          :disabled="isBtnDisable"
          @click="handleAddButtonClick"
        >添加参数</el-button>
        <!-- 动态参数表格 -->
        <el-table
          :data="list.manyTableData"
          :border="true"
          stripe
        >
          <el-table-column type="expand">
            <template v-slot="scope">
              <el-tag
                v-for="(item, index) in scope.row.attr_vals"
                :key="index"
                type="primary"
                closable
                @close="handleTagClose(scope.row, index)"
              >
                {{item}}
              </el-tag>
              <el-input
                v-if="scope.row.inputVisible"
                v-model="scope.row.inputValue"
                size="small"
                @keyup.enter="handleInputConfirm(scope.row)"
                @blur="handleInputConfirm(scope.row)"
                :autofocus="autofocus"
                type="primary"
              />
              <el-button v-else size="small" @click="showInput(scope.row)">+ New Tag</el-button>
            </template>
          </el-table-column>
          <el-table-column label="#" type="index" prop=""></el-table-column>
          <el-table-column label="参数名称" prop="attr_name"></el-table-column>
          <el-table-column label="操作">
            <template v-slot="scope">
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="handleEditButtonClick(scope.row.attr_id)"
              >编辑</el-button>
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="handleDeleteButtonClick(scope.row.attr_id)"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="静态属性" name="only">
        <el-button
          type="primary"
          :disabled="isBtnDisable"
          @click="handleAddButtonClick"
        >添加属性</el-button>
        <!-- 静态属性表格 -->
        <el-table
          :data="list.onlyTableData"
          :border="true"
          stripe
        >
          <el-table-column type="expand">
            <template v-slot="scope">
              <el-tag
                v-for="(item, index) in scope.row.attr_vals"
                :key="index"
                type="primary"
                closable
                @close="handleTagClose(scope.row, index)"
              >
                {{item}}
              </el-tag>
              <el-input
                v-if="scope.row.inputVisible"
                v-model="scope.row.inputValue"
                size="small"
                @keyup.enter="handleInputConfirm(scope.row)"
                @blur="handleInputConfirm(scope.row)"
                :autofocus="autofocus"
                class="shotwidth"
              />
              <el-button
                v-else
                size="small"
                @click="showInput(scope.row)"
              >+ New Tag</el-button>
            </template>
          </el-table-column>
          <el-table-column label="#" type="index" prop=""></el-table-column>
          <el-table-column label="属性名称" prop="attr_name"></el-table-column>
          <el-table-column label="操作">
            <template v-slot="scope">
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="handleEditButtonClick(scope.row.attr_id)"
              >编辑</el-button>
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="handleDeleteButtonClick(scope.row.attr_id)"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </el-card>
  <!-- 添加参数、属性的对话框 -->
  <el-dialog
    v-model="addDialogVisible"
    :title="'添加'+titleText"
    width="30%"
    @close="addDialogClose"
  >
    <el-form
      :model="list.addForm"
      :rules="addFormRules"
      ref="addFormRef"
      label-width="100px"
    >
      <el-form-item :label="titleText" prop="attr_name">
        <el-input v-model="list.addForm.attr_name"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
        <el-button @click="addDialogVisible=false">取消</el-button>
        <el-button type="primary" @click="handleAddDialogConfirm">确定</el-button>
    </template>
  </el-dialog>
  <!-- 编辑参数、属性的对话框 -->
  <el-dialog
    v-model="editDialogVisible"
    :title="'编辑'+titleText"
    width="30%"
    @close="editDialogClose"
  >
    <el-form
      :rules="addFormRules"
      ref="editFormRef"
      label-width="100px"
      :model="list.editForm"
    >
      <el-form-item :label="titleText" prop="attr_name">
        <el-input v-model="list.editForm.attr_name"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="editDialogVisible=false">取消</el-button>
      <el-button type="primary" @click="handleEditDialogConfirm">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { computed, getCurrentInstance, nextTick, reactive, ref } from 'vue'

const { proxy } = getCurrentInstance()

const list = reactive({
  // 接受获取到的商品分类数组
  CateList: [],
  // 选中的商品分类数组
  SelectedKeys: [],
  // 动态参数
  manyTableData: [],
  // 静态属性
  onlyTableData: [],
  // 添加参数的表单数据对象
  addForm: {
    attr_name: ''
  },
  // 编辑参数的表单数据对象
  editForm: {}
})
// 默认选中的标签页
const activeName = ref('many')
// 级联选择器配置
const Props = reactive({
  expandTrigger: 'hover',
  value: 'cat_id',
  label: 'cat_name',
  children: 'children'
})
// 控制添加对话框的显示与隐藏
const addDialogVisible = ref(false)
// 控制编辑对话框的显示与隐藏
const editDialogVisible = ref(false)
// 添加参数表单的验证规则对象
const addFormRules = {
  attr_name: [
    { required: true, message: '请输入参数名称', trigger: 'blur' }
  ]
}
// 判断按钮是否启用
const isBtnDisable = computed(() => {
  if (list.SelectedKeys.length !== 3) {
    return true
  }
  return false
})
// 当前选中的三级分类的id
const cateId = computed(() => {
  if (list.SelectedKeys.length === 3) {
    return list.SelectedKeys[2]
  }
  return null
})
// 当前对话框的类型
const titleText = computed(() => {
  if (activeName.value === 'many') return '动态参数'
  return '静态属性'
})
// 获取所有的商品分类
const getCateList = async () => {
  const { data } = await proxy.$http.get('categories')
  if (data.meta.status !== 200) return proxy.$message.error('获取商品分类列表失败')
  list.CateList = data.data
  // console.log(data)
}
getCateList()

// 获取参数的列表数据
const getParamsData = async () => {
  if (list.SelectedKeys === null) {
    list.SelectedKeys = []
    list.manyTableData = []
    list.onlyTableData = []
    return
  } else if (list.SelectedKeys.length !== 3) {
    list.SelectedKeys = []
    list.manyTableData = []
    list.onlyTableData = []
    // proxy.$message.error('只允许为三级分类设置相关参数')
    return
  }
  const { data } = await proxy.$http.get(`categories/${cateId.value}/attributes`, { params: { sel: activeName.value } })
  if (data.meta.status !== 200) return proxy.$message.error('获取参数列表失败')
  // console.log(data)
  data.data.forEach(item => {
    item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
    // 添加布尔值，控制标签输入框或按钮的显示
    item.inputVisible = false
    // 文本框中输入的值
    item.inputValue = ''
  })
  // console.log(data)
  // 判断数据类型
  if (activeName.value === 'many') {
    list.manyTableData = data.data
  } else {
    list.onlyTableData = data.data
  }
}
// 监听级联选择器商品分类改变事件
const handleChange = () => {
  // console.log(list.SelectedKeys)
  getParamsData()
}
// 监听 tag 点击事件
const handleTabClick = () => {
  getParamsData()
}
// 监听添加参数按钮点击事件
const handleAddButtonClick = () => {
  addDialogVisible.value = true
}
// 监听添加参数对话框的关闭事件
const addDialogClose = () => {
  proxy.$refs.addFormRef.resetFields()
}
// 监听添加对话框确认按钮的点击事件
const handleAddDialogConfirm = () => {
  proxy.$refs.addFormRef.validate(async (valid) => {
    if (!valid) return proxy.$message.error('请输入合法参数')
    const { data } = await proxy.$http.post(`categories/${cateId.value}/attributes`, {
      attr_name: list.addForm.attr_name,
      attr_sel: activeName.value
    })
    if (data.meta.status !== 201) return proxy.$message.error('添加参数失败')
    proxy.$message.success('添加参数成功')
    getParamsData()
    addDialogVisible.value = false
  })
}
// 监听编辑按钮的点击事件
const handleEditButtonClick = async (id) => {
  const { data } = await proxy.$http.get(`categories/${cateId.value}/attributes/${id}`, {
    params: {
      attr_sel: activeName.value
    }
  })
  if (data.meta.status !== 200) return proxy.$message.error('获取参数失败')
  list.editForm = data.data
  editDialogVisible.value = true
}
// 监听编辑参数对话框的关闭事件
const editDialogClose = () => {
  proxy.$refs.editFormRef.resetFields()
}
// 监听编辑对话框确认按钮的点击事件
const handleEditDialogConfirm = () => {
  proxy.$refs.editFormRef.validate(async (valid) => {
    if (!valid) return proxy.$message.error('请输入合法参数')
    const { data } = await proxy.$http.put(`categories/${cateId.value}/attributes/${list.editForm.attr_id}`, {
      attr_name: list.editForm.attr_name,
      attr_sel: activeName.value
    })
    if (data.meta.status !== 200) return proxy.$message.error('更新参数失败')
    proxy.$message.success('更新参数成功')
    getParamsData()
    editDialogVisible.value = false
  })
}
// 监听删除按钮的点击事件
const handleDeleteButtonClick = async (id) => {
  const res = await proxy.$confirm('该操作不可逆，是否确认删除该参数', '警告', {
    confirmButtonText: 'OK',
    cancelButtonText: 'Cancel',
    type: 'warning'
  }).catch(error => error)
  if (res === 'confirm') {
    const { data } = await proxy.$http.delete(`categories/${cateId.value}/attributes/${id}`)
    if (data.meta.status !== 200) return proxy.$message.error('删除参数失败')
    getParamsData()
    proxy.$message.success('已删除该参数')
  }
}
// 监听标签删除按钮的点击事件
const handleTagClose = async (item, index) => {
  const res = await proxy.$confirm('该操作不可逆，是否确认删除该参数', '警告', {
    confirmButtonText: 'OK',
    cancelButtonText: 'Cancel',
    type: 'warning'
  }).catch(error => error)
  if (res === 'confirm') {
    item.attr_vals.splice(index, 1)
    const { data } = await proxy.$http.put(`categories/${cateId.value}/attributes/${item.attr_id}`, {
      attr_name: item.attr_name,
      attr_sel: item.attr_sel,
      attr_vals: item.attr_vals.join(' ')
    })
    if (data.meta.status !== 200) return proxy.$message.error('删除参数失败')
    proxy.$message.success('删除参数成功')
  }
}
const autofocus = ref(false)
// 监听添加标签按钮的点击事件
const showInput = (item) => {
  item.inputVisible = true
  // 让输入框自动获得焦点
  nextTick(() => {
    autofocus.value = true
  })
}

// 监听标签输入框的确认事件
const handleInputConfirm = async (item) => {
  if (item.inputValue.trim().length === 0) {
    item.inputValue = ''
    item.inputVisible = false
    return
  }
  item.attr_vals.push(item.inputValue.trim())
  item.inputValue = ''
  item.inputVisible = false
  const { data } = await proxy.$http.put(`categories/${cateId.value}/attributes/${item.attr_id}`, {
    attr_name: item.attr_name,
    attr_sel: item.attr_sel,
    attr_vals: item.attr_vals.join(' ')
  })
  console.log(data)
  if (data.meta.status !== 200) return proxy.$message.error('添加参数失败')
  proxy.$message.success('添加参数成功')
}
</script>

<style lang="less" scoped>
.margin-top {
  margin-top: 15px;
}
.el-tag {
  margin: 5px;
}
.el-table {
  /deep/.el-input {
    width: 100px;
  }
}

</style>
