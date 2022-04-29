<template>
  <!-- 面包屑导航区 -->
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>权限管理</el-breadcrumb-item>
    <el-breadcrumb-item>权限列表</el-breadcrumb-item>
  </el-breadcrumb>
  <!-- 卡片视图区 -->
  <el-card>
    <el-table
     :border="true"
     :data="list.rightsList"
     :stripe="true"
    >
      <el-table-column type="index" label="#"></el-table-column>
      <el-table-column label="权限名称" prop="authName"></el-table-column>
      <el-table-column label="路径" prop="path"></el-table-column>
      <el-table-column label="权限等级" prop="level">
        <template v-slot="scope">
          <el-tag v-if="scope.row.level === '0'">一级</el-tag>
          <el-tag type="success" v-if="scope.row.level === '1'">二级</el-tag>
          <el-tag type="warning" v-if="scope.row.level === '2'">三级</el-tag>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script setup>
import { getCurrentInstance, reactive } from 'vue'

const { proxy } = getCurrentInstance()
// 权限列表
const list = reactive({ rightsList: [] })
// 添加角色

// 发起请求，获取权限列表数据
const getRightsList = async () => {
  const { data } = await proxy.$http.get('rights/list')
  if (data.meta.status !== 200) return proxy.$message.error('获取权限列表失败')
  list.rightsList = data.data
  // console.log(data.data)
}
getRightsList()
</script>

<style lang="less" scoped>

</style>
