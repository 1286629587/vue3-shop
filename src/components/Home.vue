<template>
  <el-button type="info" @click="logout">退出</el-button>
</template>

<script setup>
import { getCurrentInstance } from 'vue'

const { proxy } = getCurrentInstance()
const logout = () => {
  // 清空 token
  window.sessionStorage.clear()
  // 跳转到登陆页
  proxy.$router.push('/login')
}
</script>

<style lang="less" scoped>

</style>
