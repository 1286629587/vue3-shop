<template>
  <!-- 面包屑导航区 -->
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>订单管理</el-breadcrumb-item>
    <el-breadcrumb-item>订单列表</el-breadcrumb-item>
  </el-breadcrumb>
  <!-- 卡片视图区 -->
  <el-card>
    <el-row :gutter="20">
      <el-col :span="8">
        <el-input
          placeholder="请输入内容"
          v-model="list.queryInfo.query"
        >
          <template #append>
            <el-button>
              <el-icon><Search /></el-icon>
            </el-button>
          </template>
        </el-input>
      </el-col>
    </el-row>
    <!-- 表格 -->
    <el-table
      :data="list.orderList"
      :border="true"
      :stripe="true"
    >
      <el-table-column label="#" type="index" />
      <el-table-column label="订单编号" prop="order_number"/>
      <el-table-column label="订单价格" prop="order_price"/>
      <el-table-column label="是否付款" prop="pay_status">
        <template v-slot="scope">
          <el-tag type="danger" v-if="scope.row.pay_status === '0'">未付款</el-tag>
          <el-tag type="success" v-else>已付款</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="是否发货" prop="is_send"/>
      <el-table-column label="下单时间" prop="create_time">
        <template v-slot="scope">
          {{$filters.format(scope.row.create_time)}}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <el-button type="primary" size="mini" @click="handleEditClick">
          <el-icon><EditPen /></el-icon>
        </el-button>
        <el-button type="success" size="mini" @click="handleLocationClick">
          <el-icon><Location /></el-icon>
        </el-button>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      :currentPage="list.queryInfo.pagenum"
      :page-size="list.queryInfo.pagesize"
      :page-sizes="[1, 2, 5, 10]"
      :small="true"
      layout="total, sizes, prev, pager, next, jumper"
      :total="list.total"
      :disabled="false"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </el-card>
  <!-- 修改地址对话框 -->
  <el-dialog
    v-model="showEditDialogVisible"
    title="修改地址"
    width="50%"
    @close="handleEditDialogClose"
  >
    <el-form
      :model="list.addressForm"
      :rules="addressFormRules"
      ref="addressFormRef"
      label-width="100px"
    >
      <el-form-item label="省市区/县" prop="address1">
        <el-cascader
          v-model="list.addressForm.address1"
          :options="list.cityData"
          :props="Props"
          @change="handleChange"
          clearable
        />
      </el-form-item>
      <el-form-item label="详细地址" prop="address2">
        <el-input v-model="list.addressForm.address2"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button>取消</el-button>
      <el-button type="primary">确定</el-button>
    </template>
  </el-dialog>
  <!-- 展示物流进度的对话框 -->
  <el-dialog
    title="物流进度"
    v-model="showLoactionDialogVisible"
    width="50%"
  >
    <el-timeline>
      <el-timeline-item
        v-for="(item, index) in list.progressInfo"
        :key="index"
        :timestamp="item.time"
      >{{item.context}}</el-timeline-item>
    </el-timeline>
  </el-dialog>
</template>

<script setup>
import { Search, EditPen, Location } from '@element-plus/icons-vue'
import { getCurrentInstance, reactive, ref } from 'vue'
import cityData from './citydata'
const { proxy } = getCurrentInstance()
const list = reactive({
  queryInfo: {
    query: '',
    pagenum: 1,
    pagesize: 5
  },
  total: 0,
  orderList: [],
  addressForm: {
    address1: [],
    address2: ''
  },
  cityData,
  progressInfo: []
})
const showEditDialogVisible = ref(false)
const showLoactionDialogVisible = ref(false)
const addressFormRules = {
  address1: [
    { required: true, message: '请选择地址', trigger: 'blur' }
  ],
  address2: [
    { required: true, message: '请输入详细地址', trigger: 'blur' }
  ]
}
const Props = reactive({
  expandTrigger: 'hover'
})
const getOrderList = async () => {
  const { data } = await proxy.$http.get('orders', { params: list.queryInfo })
  if (data.meta.status !== 200) return proxy.$message.error('获取订单数据列表失败')
  proxy.$message.success('获取订单数据列表成功')
  // console.log(data)
  list.total = data.data.total
  list.orderList = data.data.goods
}
getOrderList()
// size点击事件
const handleSizeChange = (newSize) => {
  list.queryInfo.pagesize = newSize
  getOrderList()
}
// page点击事件
const handleCurrentChange = (newPage) => {
  list.queryInfo.pagenum = newPage
  getOrderList()
}
// 修改地址按钮点击事件
const handleEditClick = () => {
  showEditDialogVisible.value = true
}
// 对话框关闭事件
const handleEditDialogClose = () => {
  proxy.$refs.addressFormRef.resetFields()
}
// 物流进度按钮点击事件
const handleLocationClick = async () => {
  const { data } = await proxy.$http.get('/kuaidi/1106975712662')
  if (data.meta.status !== 200) return proxy.$message.error('获取物流进度失败')
  list.progressInfo = data.data
  showLoactionDialogVisible.value = true
}
</script>

<style lang="less" scoped>
/deep/.el-cascader {
  width: 100%
}
</style>
