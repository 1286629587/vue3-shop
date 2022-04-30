<template>
  <!-- 面包屑导航区 -->
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>商品管理</el-breadcrumb-item>
    <el-breadcrumb-item>商品分类</el-breadcrumb-item>
  </el-breadcrumb>
  <!-- 卡片区 -->
  <el-card>
    <el-row>
      <el-col>
        <el-button
          type="primary"
          @click="handleAddClick"
        >添加分类</el-button>
      </el-col>
    </el-row>
    <!-- 表格区 -->
    <el-row>
      <el-table
        :data="clist.cateList"
        :border="true"
        :stripe="true"
      >
        <el-table-column type="expand">
          <template v-slot="scope">
            <el-row
              :class="['bdbottom', i1 === 0 ? 'bdtop' : '', 'flexcol']"
              v-for="(item1, i1) in scope.row.children"
              :key="item1.cat_pid"
            >
              <!-- 二级分类 -->
              <el-col :span="5">
                <div class="margin">
                  <el-tag>
                  {{item1.cat_name}}
                  </el-tag>
                  <el-icon><ArrowRightBold/></el-icon>
                </div>
              </el-col>
              <!-- 三级分类 -->
              <el-col :span="19">
                <el-row>
                  <el-col
                    :span="4"
                    v-for="(item2) in item1.children"
                    :key="item2.cat_pid"
                  >
                    <div class="margin">
                      <el-tag type="warning">
                      {{item2.cat_name}}
                      </el-tag>
                    </div>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column label="分类名称" prop="cat_name"/>
        <el-table-column label="是否有效" prop="cat_deleted">
          <template v-slot="scope">
            <el-icon
              v-if="scope.row.cat_deleted === false"
              style="color: lightgreen"
            ><CircleCheckFilled /></el-icon>
            <el-icon
              v-else
              style="color: lightgreen"
            ><CircleCloseFilled /></el-icon>
          </template>
        </el-table-column>
        <el-table-column label="排序" prop="cat_level">
          <template v-slot="scope">
            <el-tag v-if="scope.row.cat_level === 0">一级</el-tag>
            <el-tag type="success" v-if="scope.row.cat_level === 1">二级</el-tag>
            <el-tag type="warning" v-if="scope.row.cat_level === 2">三级</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template v-slot="scope">
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-edit"
              @click="handleEditClick(scope.row.cat_id)"
            >编辑</el-button>
            <el-button
              type="danger"
              size="mini"
              icon="el-icon-delete"
              @click="handleDeleteClick(scope.row.cat_id)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <!-- 分页区 -->
    <el-row>
      <el-pagination
      :currentPage="queryInfo.pagenum"
      :page-size="queryInfo.pagesize"
      :page-sizes="[1, 2, 5, 10]"
      :small="true"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      :disabled="false"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    </el-row>
  </el-card>
  <!-- 添加分类的对话框 -->
  <el-dialog
    title="添加分类"
    v-model="addCateDialogVisible"
    width="30%"
    @close="addCateDialogClose"
  >
    <el-form
      :model="addCateForm"
      ref="addCateFormRef"
      :rules="addCateFormRules"
      label-width="100px"
    >
      <el-form-item label="分类名称：" prop="cat_name">
        <el-input v-model="addCateForm.cat_name"></el-input>
      </el-form-item>
      <el-form-item label="父级分类：">
        <el-cascader
          v-model="selKeys.selectedKeys"
          :options="list.parentCateList"
          :props="cascaderProps"
          @change="handleChange"
          clearable
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="addCateDialogVisible=false">取消</el-button>
        <el-button @click="addCateConfirm">确定</el-button>
      </span>
    </template>
  </el-dialog>
  <!-- 编辑分类的对话框 -->
  <el-dialog
    title="编辑分类"
    v-model="editCateDialogVisible"
    width="30%"
    @close="editCateDialogClose"
  >
    <el-form
      :model="editForm.editCateForm"
      ref="editCateFormRef"
      :rules="addCateFormRules"
      label-width="100px"
    >
      <el-form-item label="分类名称：" prop="cat_name">
        <el-input v-model="editForm.editCateForm.cat_name"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="editCateDialogVisible=false">取消</el-button>
        <el-button @click="editDialogConfirm">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { reactive, getCurrentInstance, ref } from 'vue'
import { CircleCheckFilled, CircleCloseFilled, ArrowRightBold } from '@element-plus/icons-vue'
const { proxy } = getCurrentInstance()

// 请求的商品分类数据
const { queryInfo } = reactive({
  queryInfo: {
    // 级别
    type: 3,
    // 当前页码
    pagenum: 1,
    // 每页显示的数据
    pagesize: 5
  }
})
// 商品分类的数据列表
const clist = reactive({ cateList: [] })
// 商品分类的总数
const total = ref(0)
// 添加分类的表单数据对象
const { addCateForm } = reactive({
  addCateForm: {
    cat_pid: 0,
    cat_name: '',
    cat_level: 0
  }
})

// 请求到的父级分类数据列表
const list = reactive({ parentCateList: [] })
// 请求当前编辑分类的表单数据对象
const editForm = reactive({ editCateForm: {} })

// 级联选择器配置
const cascaderProps = reactive({
  expandTrigger: 'hover',
  checkStrictly: true,
  value: 'cat_id',
  label: 'cat_name',
  children: 'children'
})
// 选中的父级分类的 id 数组
const selKeys = reactive({ selectedKeys: [] })
// console.log(selKeys)
// 添加分类的表单验证规则
// 编辑分类的表单验证规则
const addCateFormRules = {
  cat_name: [
    { required: true, message: '请输入分类', trigger: 'blur' }
  ]
}
// 获取商品数据列表
const getCateList = async () => {
  const { data } = await proxy.$http.get('categories', { params: queryInfo })
  if (data.meta.status !== 200) return proxy.$message.error('请求商品分类数据失败')
  // console.log(data)
  clist.cateList = data.data.result
  total.value = data.data.total
}
getCateList()
// 获取父级分类数据列表
const getParentCateList = async () => {
  const { data } = await proxy.$http.get('categories', {
    params: {
      type: 2
    }
  })
  if (data.meta.status !== 200) return proxy.$message.error('请求父级分类数据列表失败')
  // console.log(data.data)
  list.parentCateList = data.data
  // console.log(list)
}

// 控制添加分类对话框的显示与隐藏
const addCateDialogVisible = ref(false)
// 控制编辑分类对话框的显示与隐藏
const editCateDialogVisible = ref(false)

// 监听pagesizes点击事件
const handleSizeChange = (newSize) => {
  queryInfo.pagesize = newSize
  getCateList()
}
// 监听pagenum点击事件
const handleCurrentChange = (newPage) => {
  queryInfo.pagenum = newPage
  getCateList()
}
// 监听添加按钮点击显示对话框
const handleAddClick = () => {
  getParentCateList()
  addCateDialogVisible.value = true
}
// 监听编辑按钮点击显示对话框
const handleEditClick = async (id) => {
  // console.log(id)
  const { data } = await proxy.$http.get(`categories/${id}`)
  if (data.meta.status !== 200) return proxy.$message.error('获取分类数据失败')
  // console.log(data)
  editForm.editCateForm = data.data
  // console.log(editForm.editCateForm)
  editCateDialogVisible.value = true
}
// 监听选项变化触发事件
const handleChange = () => {
  // console.log(selKeys)
  if (selKeys.selectedKeys === null) return
  if (selKeys.selectedKeys.length > 0) {
    addCateForm.cat_pid = selKeys.selectedKeys[selKeys.selectedKeys.length - 1]
    // 为当前分类的等级赋值
    addCateForm.cat_level = selKeys.selectedKeys.length
    // console.log(addCateForm)
  } else {
    addCateForm.cat_pid = 0
    addCateForm.cat_level = 0
  }
}
// 监听添加分类对话框确认事件
const addCateConfirm = () => {
  proxy.$refs.addCateFormRef.validate(async (valid) => {
    if (!valid) return proxy.$message.error('请添加分类')
    const { data } = await proxy.$http.post('categories', addCateForm)
    if (data.meta.status !== 201) return proxy.$message.error('添加分类失败')
    proxy.$message.success('添加分类成功')
    getCateList()
    addCateDialogVisible.value = false
  })
}
// 监听编辑分类对话框确认事件
const editDialogConfirm = () => {
  proxy.$refs.editCateFormRef.validate(async (valid) => {
    if (!valid) return proxy.$message.error('请输入合法分类')
    const { data } = await proxy.$http.put(`categories/${editForm.editCateForm.cat_id}`, {
      cat_name: editForm.editCateForm.cat_name
    })
    if (data.meta.status !== 200) return proxy.$message.error('更新分类失败')
    proxy.$message.success('更新分类成功')
    getCateList()
    editCateDialogVisible.value = false
  })
}
// 监听添加分类对话框关闭事件
const addCateDialogClose = () => {
  proxy.$refs.addCateFormRef.resetFields()
  selKeys.selectedKeys = null
  addCateForm.cat_pid = 0
  addCateForm.cat_level = 0
  // console.log(selKeys)
}
// 监听编辑分类对话框关闭事件
const editCateDialogClose = () => {
  proxy.$refs.editCateFormRef.resetFields()
}
// 监听删除按钮点击事件
const handleDeleteClick = async (id) => {
  const res = await proxy.$confirm('该操作不可逆，确定删除当前分类吗', '警告', {
    confirmButtonText: '删吧',
    cancelButtonText: '不了吧',
    type: 'warning'
  }).catch(error => error)
  if (res === 'confirm') {
    const { data } = await proxy.$http.delete(`categories/${id}`)
    if (data.meta.status !== 200) return proxy.$message.error('删除分类失败')
    proxy.$message.success('删除分类成功')
    getCateList()
  }
}
</script>

<style lang="less" scoped>
/deep/.el-cascader {
  display: block;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.flexcol {
  display: flex;
  align-items: center;
}
.margin {
  margin: 10px;
}
</style>
