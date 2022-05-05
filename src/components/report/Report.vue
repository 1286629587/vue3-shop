<template>
  <!-- 面包屑导航区 -->
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>数据统计</el-breadcrumb-item>
    <el-breadcrumb-item>数据报表</el-breadcrumb-item>
  </el-breadcrumb>
  <!-- 卡片视图区 -->
  <el-card>
    <div id="main" style="width: 750px;height:400px;"></div>
  </el-card>
</template>

<script setup>
import { getCurrentInstance, onMounted, reactive } from 'vue'
import * as echarts from 'echarts'
import merge from 'deepmerge'
const { proxy } = getCurrentInstance()
// 需要合并的数据
const { options } = reactive({
  options: {
    title: {
      text: '用户来源'
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: '#E9EEF3'
        }
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: [
      {
        boundaryGap: false
      }
    ],
    yAxis: [
      {
        type: 'value'
      }
    ]
  }
})

onMounted(async () => {
  // 基于准备好的dom，初始化echarts实例
  const myChart = echarts.init(document.getElementById('main'))
  const { data } = await proxy.$http.get('reports/type/1')
  if (data.meta.status !== 200) return proxy.$message.error('获取图表数据失败')
  // 准备数据和配置项
  const newObj = merge(data.data, options)
  // 展示数据
  myChart.setOption(newObj)
})

</script>

<style lang="less" scoped>

</style>
