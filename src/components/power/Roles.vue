<template>
  <!-- 面包屑导航区 -->
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>权限管理</el-breadcrumb-item>
    <el-breadcrumb-item>角色列表</el-breadcrumb-item>
  </el-breadcrumb>
  <!-- 卡片视图 -->
  <el-card>
    <el-row>
      <el-col>
        <el-button
          type="primary"
          @click="addRolesDialogVisible=true"
        >添加角色</el-button>
      </el-col>
    </el-row>
    <!-- 角色列表 -->
    <el-table
      :data="list.roleList"
      :border="true"
      :stripe="true"
    >
      <!-- 展开列 -->
      <el-table-column type="expand">
        <template v-slot="scope">
          <el-row
            :class="['bdbottom', i1 === 0 ? 'bdtop' : '', 'flexcol']"
            v-for="(item1, i1) in scope.row.children"
            :key="item1.id"
          >
            <!-- 一级权限 -->
            <el-col :span="5">
              <div class="flexcol">
                <el-tag
                  closable
                  @close="removeRightById(scope.row, item1.id)"
                >{{item1.authName}}</el-tag>
                <el-icon><ArrowRightBold/></el-icon>
              </div>
            </el-col>
            <!-- 二级权限和三级权限 -->
            <el-col :span="19" >
              <!-- 二级权限 -->
              <el-row
                :class="[i2 === 0 ? '' : 'bdtop', 'flexcol']"
                v-for="(item2, i2) in item1.children"
                :key="item2.id"
              >
                <el-col :span="6">
                  <div class="flexcol">
                    <el-tag
                      type="success"
                      closable
                      @close="removeRightById(scope.row, item2.id)"
                    >{{item2.authName}}</el-tag>
                    <el-icon><ArrowRightBold/></el-icon>
                  </div>
                </el-col>
                <!-- 三级权限 -->
                <el-col :span="18">
                  <el-tag
                    type="warning"
                    v-for="item3 in item2.children"
                    :key="item3.id"
                    closable
                    @close="removeRightById(scope.row, item3.id)"
                  >{{item3.authName}}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
          <!-- <pre>{{scope.row}}</pre> -->
        </template>
      </el-table-column>
      <el-table-column type="index" label="#"></el-table-column>
      <el-table-column label="角色名称" prop="roleName"></el-table-column>
      <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
      <el-table-column label="操作" width="300px">
        <template v-slot="scope">
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-edit"
            @click="handleEditClick(scope.row.id)"
          >编辑</el-button>
          <el-button
            type="danger"
            size="mini"
            icon="el-icon-delete"
            @click="handleDeleteClik(scope.row.id)"
          >删除</el-button>
          <el-button
            type="warning"
            size="mini"
            icon="el-icon-setting"
            @click="showSetRightDialog(scope.row)"
          >分配权限</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
  <!-- 添加角色的对话框 -->
  <el-dialog
    v-model="addRolesDialogVisible"
    title="添加角色"
    width="30%"
    @close="handleAddClose"
  >
    <!-- 主体部分 -->
    <span>
      <el-form
        ref="addRolesFormRef"
        :model="addRolesForm"
        :rules="addRolesFormRules"
        label-width="80px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addRolesForm.roleName" />
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addRolesForm.roleDesc" />
        </el-form-item>
      </el-form>
    </span>
    <!-- 底部按钮 -->
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="addRolesDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="addRolesDialogConfirm">确定</el-button>
      </span>
    </template>
  </el-dialog>
  <!-- 编辑角色的对话框 -->
  <el-dialog
    v-model="editRolesDialogVisible"
    title="编辑角色信息"
    width="30%"
    @close="handleEditClose"
  >
    <el-form
      ref="editRolesFormRef"
      :model="editrolesform.editRolesForm"
      :rules="addRolesFormRules"
      label-width="80px"
    >
      <el-form-item label="角色名称" prop="roleName">
        <el-input v-model="editrolesform.editRolesForm.roleName"></el-input>
      </el-form-item>
      <el-form-item label="角色描述" prop="roleDesc">
        <el-input v-model="editrolesform.editRolesForm.roleDesc"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="editRolesDialogVisible=false">取消</el-button>
        <el-button type="primary" @click="editRolesDialogConfirm">确定</el-button>
      </span>
    </template>
  </el-dialog>
  <!-- 分配权限的对话框 -->
  <el-dialog
    v-model="setRightDialogVisible"
    title="分配用户权限"
    width="30%"
    @close="handleRightDialogClose"
  >
    <!-- 树形控件 -->
    <el-tree
      :data="rightslist.RightsList"
      :props="treeProps"
      show-checkbox
      node-key="id"
      default-expand-all
      :default-checked-keys="defKeys"
      ref="treeRef"
    />
    <!-- 底部按钮 -->
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="allotRights"
          >确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { reactive, getCurrentInstance, ref } from 'vue'
import { ArrowRightBold } from '@element-plus/icons-vue'

const { proxy } = getCurrentInstance()
// 角色列表数据
const list = reactive({ roleList: [] })

// 添加角色对象
const { addRolesForm } = reactive({
  addRolesForm: {
    roleName: '',
    roleDesc: ''
  }
})

// 所有权限数据
const rightslist = reactive({ RightsList: [] })
// 获取角色列表数据
const getRoleList = async () => {
  const { data } = await proxy.$http.get('roles')
  if (data.meta.status !== 200) proxy.$message.error('获取角色列表失败')
  list.roleList = data.data
  // console.log(list.roleList)
}
getRoleList()

// 添加角色对话框的显示与隐藏
const addRolesDialogVisible = ref(false)
// 编辑角色对话框的显示与隐藏
const editRolesDialogVisible = ref(false)
// 验证添加、编辑角色规则
const addRolesFormRules = {
  roleName: [
    { required: true, message: '请输入角色名称', trigger: 'blur' },
    { min: 2, max: 6, message: '角色名称的长度在2-6个字符之间', trigger: 'blur' }
  ],
  roleDesc: [
    { message: '请输入角色描述', trigger: 'blur' },
    { min: 2, max: 10, message: '密码的长度在2-10个字符之间', trigger: 'blur' }
  ]
}
// 关闭添加对话框重置表单
const handleAddClose = () => {
  proxy.$refs.addRolesFormRef.resetFields()
}
// 关闭编辑对话框重置表单
const handleEditClose = () => {
  proxy.$refs.editRolesFormRef.resetFields()
}
// 添加角色对话框确定按钮点击
const addRolesDialogConfirm = () => {
  proxy.$refs.addRolesFormRef.validate(async (valid) => {
    if (!valid) return proxy.$message.error('请填写合法信息')
    // 发起 post 请求添加角色
    const { data } = await proxy.$http.post('roles', addRolesForm)
    // console.log(data)
    if (data.meta.status !== 201) return proxy.$message.error('添加用户失败')
    proxy.$message.success(`添加用户${addRolesForm.roleName}成功`)
    addRolesDialogVisible.value = false
    getRoleList()
  })
}
// 编辑角色对话框确定按钮点击
const editRolesDialogConfirm = () => {
  proxy.$refs.editRolesFormRef.validate(async (valid) => {
    if (!valid) return proxy.$message.error('请输入合法信息')
    const { data } = await proxy.$http.put(`roles/${editrolesform.editRolesForm.roleId}`, {
      roleName: editrolesform.editRolesForm.roleName,
      roleDesc: editrolesform.editRolesForm.roleDesc
    })
    console.log(data)
    if (data.meta.status !== 200) return proxy.$message.error('编辑角色信息失败')
    proxy.$message.success('更新角色成功')
    editRolesDialogVisible.value = false
    getRoleList()
  })
}
// 当前需要编辑的角色信息
const editrolesform = reactive({
  editRolesForm: {}
})

// 编辑角色按钮点击事件
const handleEditClick = async (id) => {
  const { data } = await proxy.$http.get('roles/' + id)
  if (data.meta.status !== 200) return proxy.$message.error('获取角色列表失败')
  editrolesform.editRolesForm = data.data
  editRolesDialogVisible.value = true
}
// 删除角色按钮点击事件
const handleDeleteClik = async (id) => {
  const res = await proxy.$confirm(
    '是否确定永久删除该角色，该操作不可逆！',
    '提示',
    {
      confirmButtonText: '删吧',
      cancelButtonText: '不了吧',
      type: 'warning'
    }
  ).catch(error => error)
  if (res === 'confirm') {
    const { data } = await proxy.$http.delete('roles/' + id)
    if (data.meta.status !== 200) return proxy.$message.error('删除角色失败')
    proxy.$message.success('删除角色成功')
    getRoleList()
  }
}
// 删除权限
const removeRightById = async (role, rightId) => {
  const confirmResult = await proxy.$confirm('确定删除吗', '提示', {
    confirmButtonText: 'OK',
    cancelButtonText: 'Cancel',
    type: 'warning'
  }).catch(error => error)
  if (confirmResult === 'confirm') {
    const { data } = await proxy.$http.delete(`roles/${role.id}/rights/${rightId}`)
    // console.log(data)
    if (data.meta.status !== 200) return proxy.$message.error('删除权限失败')
    role.children = data.data
    proxy.$message.success('删除权限成功')
  }
}
// 属性控件属性绑定对象
const treeProps = {
  children: 'children',
  label: 'authName'
}
// 选中的权限数组
const { defKeys } = reactive({ defKeys: [] })
// 当前要分配权限的id
const roleId = ref()

// 控制分配权限对话框的显示与隐藏
const setRightDialogVisible = ref(false)
// 展示分配权限的对话框
const showSetRightDialog = async (role) => {
  roleId.value = role.id
  // 获取所有权限数据
  const { data } = await proxy.$http.get('rights/tree')
  if (data.meta.status !== 200) return proxy.$message.error('获取权限列表失败')
  rightslist.RightsList = data.data
  // console.log(rightslist.RightsList)
  // 递归获取三级节点的id
  getLeafKeys(role, defKeys)
  setRightDialogVisible.value = true
}
// 通过递归的形式，获取角色下所有三级权限的id，并保存到defKeys数组中
const getLeafKeys = (node, arr) => {
  if (!node.children) {
    return arr.push(node.id)
  }
  node.children.forEach(item => getLeafKeys(item, arr))
}
const handleRightDialogClose = () => {
  defKeys.splice(0)
}
// 点击确定分配角色权限
const allotRights = async () => {
  const arr = [...proxy.$refs.treeRef.getCheckedKeys(), ...proxy.$refs.treeRef.getHalfCheckedKeys()]
  // console.log(arr)
  const str = arr.join(',')
  // console.log(str)
  const { data } = await proxy.$http.post(`roles/${roleId.value}/rights`, { rids: str })
  if (data.meta.status !== 200) return proxy.$message.error('分配权限失败')
  proxy.$message.success('分配权限成功')
  getRoleList()
  setRightDialogVisible.value = false
}
</script>

<style scoped>
.el-tag {
  margin: 7px;
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
</style>
