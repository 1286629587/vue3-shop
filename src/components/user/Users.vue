<template>
  <!-- 面包屑导航区 -->
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>用户管理</el-breadcrumb-item>
    <el-breadcrumb-item>用户列表</el-breadcrumb-item>
  </el-breadcrumb>
  <!-- 卡片视图区 -->
  <el-card>
    <!-- 搜索与添加区 -->
    <el-row :gutter="20">
      <el-col :span="7">
        <el-input
          placeholder="请输入内容"
          v-model="queryInfo.query"
          clearable
          @clear="getUserList"
        >
          <template #append>
            <el-button @click="getUserList">
              <el-icon><Search /></el-icon>
            </el-button>
          </template>
        </el-input>
      </el-col>
      <el-col :span="4">
        <el-button type="primary" @click="dialogVisible=true">添加用户</el-button>
      </el-col>
    </el-row>
    <!-- 用户列表区 -->
    <el-table
     :data="sList.userList"
     :border="true"
     :stripe="true"
    >
      <el-table-column label="#" type="index" />
      <el-table-column label="用户名" prop="username" />
      <el-table-column label="邮箱" prop="email" />
      <el-table-column label="电话" prop="mobile" />
      <el-table-column label="角色" prop="role_name" />
      <el-table-column label="状态">
        <template v-slot="scope">
          <el-switch
            v-model="scope.row.mg_state"
            @change="userStateChanged(scope.row)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180px">
        <template v-slot="scope">
          <!-- 编辑 -->
          <el-button
            type="primary"
            size="mini"
            @click="handleEditClick(scope.row.id)"
          ><el-icon><Edit /></el-icon></el-button>
          <!-- 删除 -->
          <el-button
           type="danger"
           size="mini"
           @click="deleteUser(scope.row.id)"
          ><el-icon><Delete /></el-icon></el-button>
          <el-tooltip
            effect="dark"
            content="分配角色"
            placement="top-start"
            :enterable="false"
          >
            <el-button
              type="warning"
              size="mini"
              @click="setRole(scope.row)"
            ><el-icon><Setting /></el-icon></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :currentPage="queryInfo.pagenum"
      :page-size="queryInfo.pagesize"
      :page-sizes="[1, 2, 5, 10]"
      :small="true"
      layout="total, sizes, prev, pager, next, jumper"
      :total="stotal"
      :disabled="false"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </el-card>
  <!-- 添加用户的对话框 -->
  <el-dialog
    v-model="dialogVisible"
    title="添加新用户"
    width="30%"
    @close="handleClose"
  >
    <!-- 主体部分 -->
    <span>
      <el-form
        ref="addFormRef"
        :model="addForm"
        :rules="addFormRules"
        label-width="65px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email" />
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile" />
        </el-form-item>
      </el-form>
    </span>
    <!-- 底部按钮 -->
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">不了</el-button>
        <el-button type="primary" @click="addUser"
          >对的</el-button
        >
      </span>
    </template>
  </el-dialog>
  <!-- 编辑用户信息的对话框 -->
  <el-dialog
    v-model="editDialogVisible"
    title="编辑用户信息"
    width="30%"
    @close="editClose"
  >
    <!-- 主体部分 -->
    <span>
      <!-- <el-form
        ref="editFormRef"
        :model="editform.editForm"
        :rules="editFormRules"
        label-width="65px"
      >
        <el-form-item label="用户名">
          <el-input v-model="editform.editForm.username" disabled />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editform.editForm.email" />
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editform.editForm.mobile" />
        </el-form-item>
      </el-form> -->
      <el-form
        ref="editFormRef"
        :model="sList.userList[sId]"
        :rules="editFormRules"
        label-width="65px"
      >
        <el-form-item label="用户名">
          <el-input v-model="sList.userList[sId].username" disabled />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="sList.userList[sId].email" />
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="sList.userList[sId].mobile" />
        </el-form-item>
      </el-form>
    </span>
    <!-- 底部按钮 -->
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="editDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleEditConfirm"
          >确定</el-button
        >
      </span>
    </template>
  </el-dialog>
  <!-- 分配角色对话框 -->
  <el-dialog
    title="分配角色"
    v-model="setRoleDialogVisible"
    width="30%"
    @close="handleSetRoleDialogClose"
  >
    <!-- 主体部分 -->
    <div>
      <p>当前的用户：{{info.userInfo.username}}</p>
      <p>当前的角色：{{info.userInfo.role_name}}</p>
      <p>分配新角色：
        <!-- <el-select v-model="selectedRoleId" placeholder="请选择">
          <el-option
            v-for="item in rolelist.roleList"
            :key="item.id"
            :label="item.roleName"
            :value="item.id"
          />
        </el-select> -->
        <el-select v-model="selectedRoleId" placeholder="请选择">
          <el-option
            v-for="item in sRoleList.rolelist"
            :key="item.id"
            :label="item.roleName"
            :value="item.id"
          />
        </el-select>
      </p>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="setRoleDialogVisible=false">取消</el-button>
        <el-button type="primary" @click="saveRoleInfo">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { Delete, Edit, Search, Setting } from '@element-plus/icons-vue'
import { getCurrentInstance, reactive, ref } from 'vue'
const { proxy } = getCurrentInstance()

const { queryInfo, addForm } = reactive({
  queryInfo: {
    query: '',
    // 当前页数
    pagenum: 1,
    // 每页显示多少条数据
    pagesize: 2
  },
  // 添加新用户的表单数据
  addForm: {
    username: '',
    password: '',
    email: '',
    mobile: ''
  }
})
// 用户列表
const list = reactive({ userList: [] })
// 静态用户列表数据
const sList = reactive({
  userList: [
    {
      id: 500,
      username: '赛罗',
      email: '1286626262@qq.com',
      mobile: '13545353535',
      role_name: '新世代奥特曼',
      mg_state: true
    },
    {
      id: 502,
      username: '泰罗',
      email: '1286626262@qq.com',
      mobile: '13545353535',
      role_name: '奥特兄弟',
      mg_state: false
    }
  ]
})
// console.log(sList)
// 总页数
const total = ref(0)
// 静态总页数
const stotal = ref(3)
// 添加用户对话框的显示与隐藏
const dialogVisible = ref(false)
// const dialogVisible = ref(true)
// 编辑用户信息对话框的显示与隐藏
const editDialogVisible = ref(false)
// 分配角色对话框的显示与隐藏
const setRoleDialogVisible = ref(false)
// 查询到的用于编辑的用户信息
// const editform = reactive({ editForm: {} })
// 静态数据id
const sId = ref(0)

// 自定义表单验证规则
// 验证邮箱的规则
const checkEmail = (rule, value, callback) => {
  const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
  if (regEmail.test(value)) {
    // 合法
    return callback()
  } else {
    return callback(new Error('请输入合法邮箱'))
  }
}
// 验证手机号码
const checkMobile = (rule, value, callback) => {
  const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
  if (regMobile.test(value)) {
    return callback()
  } else {
    return callback(new Error('请输入合法手机号码'))
  }
}

// 添加新用户的表单验证规则
const addFormRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 2, max: 10, message: '用户名的长度在3-10个字符之间', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 15, message: '密码的长度在6-15个字符之间', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { validator: checkEmail, trigger: 'blur' }
  ],
  mobile: [
    { required: true, message: '请输入手机号码', trigger: 'blur' },
    { validator: checkMobile, trigger: 'blur' }
  ]
}
// 修改表单的验证规则
const editFormRules = {
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { validator: checkEmail, trigger: 'blur' }
  ],
  mobile: [
    { required: true, message: '请输入手机号码', trigger: 'blur' },
    { validator: checkMobile, trigger: 'blur' }
  ]
}
// console.log(queryInfo)
// 获取用户列表
const getUserList = async () => {
  const { data } = await proxy.$http.get('users', { params: queryInfo })
  // console.log(data)
  if (data.meta.status !== 200) return proxy.$message.error('获取用户列表失败了')
  list.userList = data.data.users
  // console.log(list.userList)
  total.value = data.data.total
}
getUserList()

// 监听下拉框pagesize改变的事件
const handleSizeChange = (newSize) => {
  // console.log(newSize)
  queryInfo.pagesize = newSize
  getUserList()
}
// 监听页码值的改变的事件
const handleCurrentChange = (newPage) => {
  // console.log(newPage)
  queryInfo.pagenum = newPage
  getUserList()
}
// 监听 switch 开关状态的改变
const userStateChanged = async (info) => {
  // console.log(info)
  // 修改用户状态
  // const { data } = await proxy.$http.put(`users/${info.id}/state/${info.mg_state}`)
  // console.log(data)
  // if (data.meta.status !== 200) {
  // info.mg_state = !info.mg_state
  // return proxy.$message.error(`修改用户${info.username}状态失败`)
  // }
  proxy.$message.success(`修改用户${info.username}状态成功`)
}

// 监听对话框关闭的事件
const handleClose = () => {
  // 重置表单
  // console.log(proxy)
  proxy.$refs.addFormRef.resetFields()
}
// 添加新用户
const addUser = () => {
  proxy.$refs.addFormRef.validate(async (valid) => {
    if (!valid) return proxy.$message.error('请填写合法信息')
    // 发起 post 请求添加新用户
    // const { data } = await proxy.$http.post('users', addForm)
    // console.log(data)
    // if (data.meta.status !== 201) return proxy.$message.error('添加用户失败')
    console.log(addForm)
    const form = JSON.parse(JSON.stringify(addForm))
    console.log(form)
    sList.userList.push(form)
    // console.log(sList.userList)
    proxy.$message.success(`添加用户${addForm.username}成功`)
    dialogVisible.value = false
    // getUserList()
  })
}

// 编辑按钮点击事件,显示编辑用户的对话框
const handleEditClick = async (id) => {
  // const { data } = await proxy.$http.get('users/' + id)
  // if (data.meta.status !== 200) return proxy.$message.error('查询用户信息失败')
  // editform.editForm = data.data
  const index = sList.userList.map((item) => item.id).indexOf(id)
  sId.value = index
  editDialogVisible.value = true
  // console.log(editform.editForm)
  // console.log(id)
}
// 关闭编辑对话框
const editClose = () => {
  proxy.$refs.editFormRef.resetFields()
}

// 确定按钮修改用户信息
const handleEditConfirm = () => {
  proxy.$refs.editFormRef.validate(async (valid) => {
    if (!valid) return proxy.$message.error('请填写合法的信息')
    // const { data } = await proxy.$http.put('users/' + editform.editForm.id, {
    //   email: editform.editForm.email,
    //   mobile: editform.editForm.mobile
    // })
    // if (data.meta.status !== 200) return proxy.$message.error('修改用户信息失败')
    editDialogVisible.value = false
    // getUserList()
    proxy.$message.success('修改用户信息成功')
  })
}
// 删除用户信息
const deleteUser = async (id) => {
  // 弹框确认是否删除
  const res = await proxy.$confirm(
    '是否确定永久删除该用户，该操作不可逆！',
    '提示',
    {
      confirmButtonText: '删吧',
      cancelButtonText: '不了吧',
      type: 'warning'
    }
  ).catch(err => err)
  if (res === 'confirm') {
    // const { data } = await proxy.$http.delete('users/' + id)
    // if (data.meta.status !== 200) return proxy.$message.error('删除用户失败')
    const index = sList.userList.map((item) => item.id).indexOf(id)
    sList.userList.splice(index, 1)
    proxy.$message.success('删除成功')
    // getUserList()
  }
}
// 需要被分配角色的用户信息
const info = reactive({ userInfo: {} })
// 获取到的角色列表
// const rolelist = reactive({ roleList: [] })
// 静态角色列表
const sRoleList = reactive({
  rolelist: [
    {
      id: 30,
      roleName: '奥特之父'
    },
    {
      id: 31,
      roleName: '奥特之母'
    },
    {
      id: 32,
      roleName: '奥特兄弟'
    },
    {
      id: 33,
      roleName: '平成三杰'
    },
    {
      id: 34,
      roleName: '新世代奥特曼'
    }
  ]
})
// console.log(sRoleList)
// 已选中的角色id值
const selectedRoleId = ref('')
// 分配角色按钮点击
const setRole = async (userInfo) => {
  info.userInfo = userInfo
  // 获取所有角色列表
  // const { data } = await proxy.$http.get('roles')
  // if (data.meta.status !== 200) return proxy.$message.error('获取角色列表失败')
  // rolelist.roleList = data.data
  setRoleDialogVisible.value = true
}
// 点击确定按钮，保存分配的角色信息
const saveRoleInfo = async () => {
  if (!selectedRoleId.value) return proxy.$message.error('请选择需要分配的角色')
  // const { data } = await proxy.$http.put(`users/${info.userInfo.id}/role`, { rid: selectedRoleId.value })
  // if (data.meta.status !== 200) return proxy.$message.error('分配角色失败')
  proxy.$message.success('分配角色成功')
  // getUserList()
  setRoleDialogVisible.value = false
}
const handleSetRoleDialogClose = () => {
  selectedRoleId.value = ''
  info.userInfo = {}
}
</script>

<style lang="less" scoped>

</style>
