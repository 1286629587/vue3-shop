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
// import { getCurrentInstance, onMounted, reactive } from 'vue'
import { onMounted, reactive } from 'vue'
import * as echarts from 'echarts'
// import merge from 'deepmerge'
// const { proxy } = getCurrentInstance()
// 需要合并的数据
// const { options } = reactive({
//   options: {
//     title: {
//       text: '用户来源'
//     },
//     tooltip: {
//       trigger: 'axis',
//       axisPointer: {
//         type: 'cross',
//         label: {
//           backgroundColor: '#E9EEF3'
//         }
//       }
//     },
//     grid: {
//       left: '3%',
//       right: '4%',
//       bottom: '3%',
//       containLabel: true
//     },
//     xAxis: [
//       {
//         boundaryGap: false
//       }
//     ],
//     yAxis: [
//       {
//         type: 'value'
//       }
//     ]
//   }
// })
// 静态合并后的数据
const sNewObj = reactive({
  legend: {
    data: [
      '华东',
      '华南',
      '华北',
      '西部',
      '其他'
    ]
  },
  yAxis: [
    {
      type: 'value'
    },
    {
      type: 'value'
    }
  ],
  xAxis: [
    {
      data: [
        '2022-03-30',
        '2022-03-31',
        '2022-04-01',
        '2022-04-02',
        '2022-04-03',
        '2022-04-04'
      ]
    },
    {
      boundaryGap: false
    }
  ],
  series: [
    {
      name: '华东',
      type: 'line',
      stack: '总量',
      areaStyle: {
        normal: {}
      },
      data: [
        2999,
        3111,
        4100,
        3565,
        3528,
        6000
      ]
    },
    {
      name: '华南',
      type: 'line',
      stack: '总量',
      areaStyle: {
        normal: {}
      },
      data: [
        5090,
        2500,
        3400,
        6000,
        6400,
        7800
      ]
    },
    {
      name: '华北',
      type: 'line',
      stack: '总量',
      areaStyle: {
        normal: {}
      },
      data: [
        6888,
        4000,
        8010,
        12321,
        13928,
        12984
      ]
    },
    {
      name: '西部',
      type: 'line',
      stack: '总量',
      areaStyle: {
        normal: {}
      },
      data: [
        9991,
        4130,
        7777,
        12903,
        13098,
        14028
      ]
    },
    {
      name: '其他',
      type: 'line',
      stack: '总量',
      areaStyle: {
        normal: {}
      },
      data: [
        15212,
        5800,
        10241,
        14821,
        15982,
        14091
      ]
    }
  ],
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
  }
})
// onMounted(async () => {
onMounted(() => {
  // 基于准备好的dom，初始化echarts实例
  const myChart = echarts.init(document.getElementById('main'))
  // const { data } = await proxy.$http.get('reports/type/1')
  // if (data.meta.status !== 200) return proxy.$message.error('获取图表数据失败')
  // 准备数据和配置项
  // const newObj = merge(data.data, options)
  // 展示数据
  // myChart.setOption(newObj)
  myChart.setOption(sNewObj)
})

</script>

<style lang="less" scoped>

</style>
