<template>
  <!-- 面包屑导航区 -->
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>商品管理</el-breadcrumb-item>
    <el-breadcrumb-item>商品列表</el-breadcrumb-item>
  </el-breadcrumb>
  <!-- 卡片视图区 -->
  <el-card>
    <el-row :gutter="20">
      <el-col :span="8">
        <el-input
          placeholder="请输入内容"
          v-model="list.queryInfo.query"
          clearable
          @clear="handleClear"
        >
          <template #append>
            <el-button @click="handleSearchButtonClick">
              <el-icon><Search /></el-icon>
            </el-button>
          </template>
        </el-input>
      </el-col>
      <el-col :span="4">
        <el-button type="primary" @click="handleAddButtonClick">添加商品</el-button>
      </el-col>
    </el-row>
    <el-table
      :data="list.goodsList"
      :border="true"
      :stripe="true"
    >
      <el-table-column type="index" label="#"/>
      <el-table-column label="商品名称" prop="goods_name"/>
      <el-table-column label="商品价格(元)" prop="goods_price" width="100px"/>
      <el-table-column label="商品重量" prop="goods_weight" width="100px"/>
      <el-table-column label="创建时间" prop="add_time" width="200px">
        <template v-slot="scope">
          {{$filters.format(scope.row.add_time)}}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="130px">
        <template v-slot="scope">
          <el-button
            type="primary"
            size="mini"
            @click="handleEditClick"
          ><el-icon><Edit /></el-icon></el-button>
          <el-button
            type="danger"
            size="mini"
            @click="handleDeleteClick(scope.row.goods_id)"
          ><el-icon><Delete /></el-icon></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-model:currentPage="list.queryInfo.pagenum"
      v-model:page-size="list.queryInfo.pagesize"
      :page-sizes="[10, 20, 30, 50]"
      :small="true"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      :disabled="false"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </el-card>
</template>

<script setup>
import { Search, Edit, Delete } from '@element-plus/icons-vue'
import { getCurrentInstance, reactive, ref } from 'vue'
const { proxy } = getCurrentInstance()
const list = reactive({
  // 查询参数对象
  queryInfo: {
    // 查询参数
    query: '',
    // 当前页数
    pagenum: 1,
    // 每页显示信息条数
    pagesize: 10
  },
  // 保存获取到的商品数据列表
  goodsList: []
})
const total = ref(0)
// 发起请求，获取商品列表数据
const getGoodsList = async () => {
  const { data } = await proxy.$http.get('goods', { params: list.queryInfo })
  if (data.meta.status !== 200) return proxy.$message.error('获取商品列表数据失败')
  proxy.$message.success('获取商品列表信息成功')
  list.goodsList = data.data.goods
  total.value = data.data.total
  // console.log(data)
}
getGoodsList()
// 监听size变化触发的事件
const handleSizeChange = (newSize) => {
  list.queryInfo.pagesize = newSize
  getGoodsList()
}
// 监听page变化触发的事件
const handleCurrentChange = (newPage) => {
  list.queryInfo.pagenum = newPage
  getGoodsList()
}
// 监听搜索按钮的点击事件
const handleSearchButtonClick = () => {
  getGoodsList()
}
// 监听输入框清除的点击事件
const handleClear = () => {
  getGoodsList()
}
// 监听编辑按钮的点击事件
const handleEditClick = () => {
  console.log('点了')
}
// 监听删除按钮的点击事件
const handleDeleteClick = async (id) => {
  console.log(id)
  const res = await proxy.$confirm('该操作不可逆，是否确认删除', '警告', {
    confirmButtonText: '删吧',
    cancelButtonText: '不了吧',
    type: 'warning'
  }).catch(error => error)
  console.log(res)
  if (res === 'confirm') {
    const { data } = await proxy.$http.delete('goods/' + id)
    console.log(data)
    if (data.meta.status !== 200) return proxy.$message.error('删除商品失败')
    proxy.$message.success('删除商品成功')
    getGoodsList()
  }
}
// 监听添加按钮的点击事件
const handleAddButtonClick = () => {
  proxy.$router.push('/goods/add')
}
</script>

<style lang="less" scoped>

</style>
