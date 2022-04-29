<template>
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img src="../assets/logo.png">
        <span>啊达后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <!-- 页面主体区 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '55px' : '200px'">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <!-- 侧边栏菜单区域 -->
        <el-menu
          active-text-color="#409bff"
          background-color="#333744"
          text-color="#fff"
          :collapse="isCollapse"
          :collapse-transition="false"
          :unique-opened="true"
          :router="true"
          :default-active="activePath"
        >
          <!-- 一级菜单 -->
          <el-submenu :index="item.id+''" :key="item.id" v-for="item in menuList">
            <!-- 一级菜单模板区域 -->
            <template #title>
              <!-- 图标 -->
              <el-icon v-if="item.id === 125"><Avatar /></el-icon>
              <el-icon v-if="item.id === 103"><Grid /></el-icon>
              <el-icon v-if="item.id === 101"><Shop /></el-icon>
              <el-icon v-if="item.id === 102"><List /></el-icon>
              <el-icon v-if="item.id === 145"><TrendCharts /></el-icon>
              <!-- 文本 -->
              <span>{{item.authName}}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item
             :index="'/'+citem.path"
             :key="citem.id"
             v-for="citem in item.children"
             @click="saveNavState('/'+citem.path)"
            >
              <template #title>
                <!-- 图标 -->
                <el-icon><Menu /></el-icon>
                <!-- 文本 -->
                <span>{{citem.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧内容主体 -->
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { getCurrentInstance, reactive, ref } from 'vue'
import { Menu, Avatar, Grid, Shop, List, TrendCharts } from '@element-plus/icons-vue'

const { proxy } = getCurrentInstance()
const { menuList } = reactive({ menuList: [] })
// 是否折叠
const isCollapse = ref(false)
// 用于保存激活状态的菜单地址
const activePath = ref('')

// 退出
const logout = () => {
  // 清空 token
  window.sessionStorage.clear()
  // 跳转到登陆页
  proxy.$router.push('/login')
}

// 获取菜单数据，保存至menuList
const getMemuList = async () => {
  const { data } = await proxy.$http.get('menus')
  if (data.meta.status !== 200) return proxy.$message.error(data.meta.msg)
  for (const key in data.data) {
    menuList.push(data.data[key])
  }
}
getMemuList()

// 点击按钮，切换菜单的折叠与展开
const toggleCollapse = () => {
  isCollapse.value = !isCollapse.value
  // isCollapse.isCollapse = !isCollapse.isCollapse
  // console.log(isCollapse)
}
// 点击菜单，保存路径,保存高亮状态
const saveNavState = (Path) => {
  // console.log(path)
  window.sessionStorage.setItem('activePath', Path)
  activePath.value = Path
}
activePath.value = window.sessionStorage.getItem('activePath')
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;
}
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: #fff;
  font-size: 20px;
  >div {
    display: flex;
    align-items: center;
    span {
      margin-left: 15px;
    }
  }
  img {
    width: 55px;
    border-radius: 50%;
  }
}

.el-aside {
  background-color: #333744;
  .toggle-button {
    background-color: #4a5064;
    color: #fff;
    line-height: 24px;
    font-size: 12px;
    text-align: center;
    letter-spacing: 0.2em;
    cursor: pointer;
  }
  .el-menu {
    border-right: 0;
  }
}

.el-main {
  background-color: #eaedf1;
}
.el-icon {
  margin-right: 5px;
}
</style>
