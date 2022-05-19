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
      :data="sList"
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
// 静态商品数据列表
const sList = reactive([
  {
    goods_id: 928,
    cat_id: null,
    goods_name: '是',
    goods_price: 1,
    goods_number: 1,
    goods_weight: 1,
    goods_state: null,
    add_time: 1651686957,
    upd_time: 1651686957,
    hot_mumber: 0,
    is_promote: false,
    cat_one_id: null,
    cat_two_id: null,
    cat_three_id: null
  },
  {
    goods_id: 926,
    cat_id: null,
    goods_name: '【海外购自营】黎珐(ReFa) MTG日本 CARAT铂金微电流瘦脸瘦身提拉紧致V脸美容仪 【保税仓发货】',
    goods_price: 1399,
    goods_number: 100,
    goods_weight: 100,
    goods_state: 0,
    add_time: 1514345477,
    upd_time: 1514345477,
    hot_mumber: 0,
    is_promote: false,
    cat_one_id: null,
    cat_two_id: null,
    cat_three_id: null
  },
  {
    goods_id: 925,
    cat_id: null,
    goods_name: '卡奇莱德汽车车载空气净化器负离子除甲醛PM2.5除烟异味车用氧吧双涡轮出风（红色）',
    goods_price: 168,
    goods_number: 100,
    goods_weight: 100,
    goods_state: 0,
    add_time: 1514259452,
    upd_time: 1514259452,
    hot_mumber: 0,
    is_promote: false,
    cat_one_id: null,
    cat_two_id: null,
    cat_three_id: null
  },
  {
    goods_id: 924,
    cat_id: null,
    goods_name: '沿途（yantu）车载充电器车充一拖二usb转接口手机智能头多功能汽车点烟器',
    goods_price: 0,
    goods_number: 100,
    goods_weight: 100,
    goods_state: 0,
    add_time: 1514259448,
    upd_time: 1514259448,
    hot_mumber: 0,
    is_promote: false,
    cat_one_id: null,
    cat_two_id: null,
    cat_three_id: null
  },
  {
    goods_id: 923,
    cat_id: null,
    goods_name: '车载冰箱7.5L 冷暖两用汽车冰箱半导体12V迷你电冰箱升级款',
    goods_price: 149,
    goods_number: 100,
    goods_weight: 100,
    goods_state: 0,
    add_time: 1514259445,
    upd_time: 1514259445,
    hot_mumber: 0,
    is_promote: false,
    cat_one_id: null,
    cat_two_id: null,
    cat_three_id: null
  },
  {
    goods_id: 922,
    cat_id: null,
    goods_name: '神行者电子狗 神行者L70电子狗测速 测速雷达 流动测速 多种警示路段提醒',
    goods_price: 98,
    goods_number: 100,
    goods_weight: 100,
    goods_state: 0,
    add_time: 1514259442,
    upd_time: 1514259442,
    hot_mumber: 0,
    is_promote: false,
    cat_one_id: null,
    cat_two_id: null,
    cat_three_id: null
  },
  {
    goods_id: 921,
    cat_id: null,
    goods_name: '360行车记录仪尊享升级版 J501C 安霸A12 高清夜视 WIFI连接 智能管理 机卡套装 黑色(存储卡品牌随机)',
    goods_price: 359,
    goods_number: 100,
    goods_weight: 100,
    goods_state: 0,
    add_time: 1514259438,
    upd_time: 1514259438,
    hot_mumber: 0,
    is_promote: false,
    cat_one_id: null,
    cat_two_id: null,
    cat_three_id: null
  },
  {
    goods_id: 920,
    cat_id: null,
    goods_name: '淘尔杰汽车专用伸缩蜡拖 除尘车掸子擦车拖把 洗车蜡刷清洁工具用品',
    goods_price: 39,
    goods_number: 100,
    goods_weight: 100,
    goods_state: 0,
    add_time: 1514259435,
    upd_time: 1514259435,
    hot_mumber: 0,
    is_promote: false,
    cat_one_id: null,
    cat_two_id: null,
    cat_three_id: null
  },
  {
    goods_id: 919,
    cat_id: null,
    goods_name: '保赐利(botny) 防雾剂汽车用长效雾清车窗挡风玻璃浴室去雾剂除雾剂玻璃清洁剂 B-2113',
    goods_price: 0,
    goods_number: 100,
    goods_weight: 100,
    goods_state: 0,
    add_time: 1514259432,
    upd_time: 1514259432,
    hot_mumber: 0,
    is_promote: false,
    cat_one_id: null,
    cat_two_id: null,
    cat_three_id: null
  },
  {
    goods_id: 918,
    cat_id: null,
    goods_name: '龟牌硬壳蜡新汽车防护划痕去污上光抛光养护漆固体洗车打蜡腊正品',
    goods_price: 49,
    goods_number: 100,
    goods_weight: 100,
    goods_state: 0,
    add_time: 1514259429,
    upd_time: 1514259429,
    hot_mumber: 0,
    is_promote: false,
    cat_one_id: null,
    cat_two_id: null,
    cat_three_id: null
  }
])
const total = ref(0)
// 发起请求，获取商品列表数据
const getGoodsList = async () => {
  const { data } = await proxy.$http.get('goods', { params: list.queryInfo })
  if (data.meta.status !== 200) return proxy.$message.error('获取商品列表数据失败')
  proxy.$message.success('获取商品列表信息成功')
  list.goodsList = data.data.goods
  total.value = data.data.total
  // console.log(list.goodsList)
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
