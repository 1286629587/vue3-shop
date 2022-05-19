<template>
  <!-- 面包屑导航区 -->
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>商品管理</el-breadcrumb-item>
    <el-breadcrumb-item>商品分类</el-breadcrumb-item>
  </el-breadcrumb>
  <!-- 卡片区 -->
  <el-card>
    <el-row>
      <el-col>
        <el-button
          type="primary"
          @click="handleAddClick"
        >添加分类</el-button>
      </el-col>
    </el-row>
    <!-- 表格区 -->
    <el-row>
      <el-table
        :data="sCList"
        :border="true"
        :stripe="true"
      >
        <el-table-column type="expand">
          <template v-slot="scope">
            <el-row
              :class="['bdbottom', i1 === 0 ? 'bdtop' : '', 'flexcol']"
              v-for="(item1, i1) in scope.row.children"
              :key="item1.cat_pid"
            >
              <!-- 二级分类 -->
              <el-col :span="5">
                <div class="margin">
                  <el-tag>
                  {{item1.cat_name}}
                  </el-tag>
                  <el-icon><ArrowRightBold/></el-icon>
                </div>
              </el-col>
              <!-- 三级分类 -->
              <el-col :span="19">
                <el-row>
                  <el-col
                    :span="4"
                    v-for="(item2) in item1.children"
                    :key="item2.cat_pid"
                  >
                    <div class="margin">
                      <el-tag type="warning">
                      {{item2.cat_name}}
                      </el-tag>
                    </div>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column label="分类名称" prop="cat_name"/>
        <el-table-column label="是否有效" prop="cat_deleted">
          <template v-slot="scope">
            <el-icon
              v-if="scope.row.cat_deleted === false"
              style="color: lightgreen"
            ><CircleCheckFilled /></el-icon>
            <el-icon
              v-else
              style="color: lightgreen"
            ><CircleCloseFilled /></el-icon>
          </template>
        </el-table-column>
        <el-table-column label="排序" prop="cat_level">
          <template v-slot="scope">
            <el-tag v-if="scope.row.cat_level === 0">一级</el-tag>
            <el-tag type="success" v-if="scope.row.cat_level === 1">二级</el-tag>
            <el-tag type="warning" v-if="scope.row.cat_level === 2">三级</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template v-slot="scope">
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-edit"
              @click="handleEditClick(scope.row.cat_id)"
            >编辑</el-button>
            <el-button
              type="danger"
              size="mini"
              icon="el-icon-delete"
              @click="handleDeleteClick(scope.row.cat_id)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <!-- 分页区 -->
    <el-row>
      <el-pagination
      :currentPage="queryInfo.pagenum"
      :page-size="queryInfo.pagesize"
      :page-sizes="[1, 2, 5, 10]"
      :small="true"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      :disabled="false"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    </el-row>
  </el-card>
  <!-- 添加分类的对话框 -->
  <el-dialog
    title="添加分类"
    v-model="addCateDialogVisible"
    width="30%"
    @close="addCateDialogClose"
  >
    <el-form
      :model="addCateForm"
      ref="addCateFormRef"
      :rules="addCateFormRules"
      label-width="100px"
    >
      <el-form-item label="分类名称：" prop="cat_name">
        <el-input v-model="addCateForm.cat_name"></el-input>
      </el-form-item>
      <el-form-item label="父级分类：">
        <el-cascader
          v-model="selKeys.selectedKeys"
          :options="list.parentCateList"
          :props="cascaderProps"
          @change="handleChange"
          clearable
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="addCateDialogVisible=false">取消</el-button>
        <el-button @click="addCateConfirm">确定</el-button>
      </span>
    </template>
  </el-dialog>
  <!-- 编辑分类的对话框 -->
  <el-dialog
    title="编辑分类"
    v-model="editCateDialogVisible"
    width="30%"
    @close="editCateDialogClose"
  >
    <el-form
      :model="editForm.editCateForm"
      ref="editCateFormRef"
      :rules="addCateFormRules"
      label-width="100px"
    >
      <el-form-item label="分类名称：" prop="cat_name">
        <el-input v-model="editForm.editCateForm.cat_name"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="editCateDialogVisible=false">取消</el-button>
        <el-button @click="editDialogConfirm">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { reactive, getCurrentInstance, ref } from 'vue'
import { CircleCheckFilled, CircleCloseFilled, ArrowRightBold } from '@element-plus/icons-vue'
const { proxy } = getCurrentInstance()

// 请求的商品分类数据
const { queryInfo } = reactive({
  queryInfo: {
    // 级别
    type: 3,
    // 当前页码
    pagenum: 1,
    // 每页显示的数据
    pagesize: 5
  }
})
// 商品分类的数据列表
const clist = reactive({ cateList: [] })
// 静态商品分类数据列表
const sCList = reactive([
  {
    cat_id: 1,
    cat_name: '大家电',
    cat_pid: 0,
    cat_level: 0,
    cat_deleted: false,
    children: [
      {
        cat_id: 3,
        cat_name: '电视',
        cat_pid: 1,
        cat_level: 1,
        cat_deleted: false,
        children: [
          {
            cat_id: 6,
            cat_name: '曲面电视',
            cat_pid: 3,
            cat_level: 2,
            cat_deleted: false
          },
          {
            cat_id: 7,
            cat_name: '海信',
            cat_pid: 3,
            cat_level: 2,
            cat_deleted: false
          },
          {
            cat_id: 8,
            cat_name: '夏普',
            cat_pid: 3,
            cat_level: 2,
            cat_deleted: false
          },
          {
            cat_id: 9,
            cat_name: '创维',
            cat_pid: 3,
            cat_level: 2,
            cat_deleted: false
          },
          {
            cat_id: 10,
            cat_name: 'TCL',
            cat_pid: 3,
            cat_level: 2,
            cat_deleted: false
          },
          {
            cat_id: 11,
            cat_name: 'PPTV',
            cat_pid: 3,
            cat_level: 2,
            cat_deleted: false
          },
          {
            cat_id: 12,
            cat_name: '小米',
            cat_pid: 3,
            cat_level: 2,
            cat_deleted: false
          },
          {
            cat_id: 13,
            cat_name: '长虹',
            cat_pid: 3,
            cat_level: 2,
            cat_deleted: false
          },
          {
            cat_id: 14,
            cat_name: '康佳',
            cat_pid: 3,
            cat_level: 2,
            cat_deleted: false
          },
          {
            cat_id: 15,
            cat_name: '三星',
            cat_pid: 3,
            cat_level: 2,
            cat_deleted: false
          },
          {
            cat_id: 16,
            cat_name: '飞利浦',
            cat_pid: 3,
            cat_level: 2,
            cat_deleted: false
          },
          {
            cat_id: 17,
            cat_name: '索尼',
            cat_pid: 3,
            cat_level: 2,
            cat_deleted: false
          },
          {
            cat_id: 18,
            cat_name: '先锋',
            cat_pid: 3,
            cat_level: 2,
            cat_deleted: false
          },
          {
            cat_id: 19,
            cat_name: '家庭影院',
            cat_pid: 3,
            cat_level: 2,
            cat_deleted: false
          },
          {
            cat_id: 20,
            cat_name: '音响',
            cat_pid: 3,
            cat_level: 2,
            cat_deleted: false
          },
          {
            cat_id: 21,
            cat_name: '盒子',
            cat_pid: 3,
            cat_level: 2,
            cat_deleted: false
          }
        ]
      },
      {
        cat_id: 4,
        cat_name: '空调',
        cat_pid: 1,
        cat_level: 1,
        cat_deleted: false,
        children: [
          {
            cat_id: 23,
            cat_name: '变频空调',
            cat_pid: 4,
            cat_level: 2,
            cat_deleted: false
          },
          {
            cat_id: 24,
            cat_name: '立柜空调',
            cat_pid: 4,
            cat_level: 2,
            cat_deleted: false
          },
          {
            cat_id: 25,
            cat_name: '挂壁空调',
            cat_pid: 4,
            cat_level: 2,
            cat_deleted: false
          },
          {
            cat_id: 27,
            cat_name: '中央空调',
            cat_pid: 4,
            cat_level: 2,
            cat_deleted: false
          },
          {
            cat_id: 28,
            cat_name: '移动空调',
            cat_pid: 4,
            cat_level: 2,
            cat_deleted: false
          },
          {
            cat_id: 29,
            cat_name: '海尔',
            cat_pid: 4,
            cat_level: 2,
            cat_deleted: false
          },
          {
            cat_id: 30,
            cat_name: '三菱重工',
            cat_pid: 4,
            cat_level: 2,
            cat_deleted: false
          },
          {
            cat_id: 31,
            cat_name: '志高',
            cat_pid: 4,
            cat_level: 2,
            cat_deleted: false
          },
          {
            cat_id: 32,
            cat_name: '奥克斯',
            cat_pid: 4,
            cat_level: 2,
            cat_deleted: false
          },
          {
            cat_id: 33,
            cat_name: '长虹',
            cat_pid: 4,
            cat_level: 2,
            cat_deleted: false
          },
          {
            cat_id: 34,
            cat_name: '科龙',
            cat_pid: 4,
            cat_level: 2,
            cat_deleted: false
          },
          {
            cat_id: 35,
            cat_name: '海信',
            cat_pid: 4,
            cat_level: 2,
            cat_deleted: false
          },
          {
            cat_id: 36,
            cat_name: '惠而浦',
            cat_pid: 4,
            cat_level: 2,
            cat_deleted: false
          },
          {
            cat_id: 37,
            cat_name: '空调清洗',
            cat_pid: 4,
            cat_level: 2,
            cat_deleted: false
          },
          {
            cat_id: 38,
            cat_name: '空调维修',
            cat_pid: 4,
            cat_level: 2,
            cat_deleted: false
          },
          {
            cat_id: 39,
            cat_name: '空调安装',
            cat_pid: 4,
            cat_level: 2,
            cat_deleted: false
          },
          {
            cat_id: 40,
            cat_name: '空调回收',
            cat_pid: 4,
            cat_level: 2,
            cat_deleted: false
          }
        ]
      },
      {
        cat_id: 26,
        cat_name: '洗衣机',
        cat_pid: 1,
        cat_level: 1,
        cat_deleted: false,
        children: [
          {
            cat_id: 42,
            cat_name: '洗衣机',
            cat_pid: 26,
            cat_level: 2,
            cat_deleted: false
          },
          {
            cat_id: 43,
            cat_name: '滚筒洗衣机',
            cat_pid: 26,
            cat_level: 2,
            cat_deleted: false
          },
          {
            cat_id: 44,
            cat_name: '波轮洗衣机',
            cat_pid: 26,
            cat_level: 2,
            cat_deleted: false
          },
          {
            cat_id: 46,
            cat_name: '大容量洗衣机',
            cat_pid: 26,
            cat_level: 2,
            cat_deleted: false
          },
          {
            cat_id: 47,
            cat_name: '迷你洗衣机',
            cat_pid: 26,
            cat_level: 2,
            cat_deleted: false
          },
          {
            cat_id: 48,
            cat_name: '双缸洗衣机',
            cat_pid: 26,
            cat_level: 2,
            cat_deleted: false
          },
          {
            cat_id: 49,
            cat_name: '干衣机',
            cat_pid: 26,
            cat_level: 2,
            cat_deleted: false
          },
          {
            cat_id: 50,
            cat_name: '洗衣机服务',
            cat_pid: 26,
            cat_level: 2,
            cat_deleted: false
          },
          {
            cat_id: 51,
            cat_name: '西门子',
            cat_pid: 26,
            cat_level: 2,
            cat_deleted: false
          },
          {
            cat_id: 53,
            cat_name: '海尔',
            cat_pid: 26,
            cat_level: 2,
            cat_deleted: false
          },
          {
            cat_id: 54,
            cat_name: '小天鹅',
            cat_pid: 26,
            cat_level: 2,
            cat_deleted: false
          }
        ]
      },
      {
        cat_id: 45,
        cat_name: '冰箱',
        cat_pid: 1,
        cat_level: 1,
        cat_deleted: false,
        children: [
          {
            cat_id: 56,
            cat_name: '对开门冰箱',
            cat_pid: 45,
            cat_level: 2,
            cat_deleted: false
          },
          {
            cat_id: 58,
            cat_name: '多门冰箱',
            cat_pid: 45,
            cat_level: 2,
            cat_deleted: false
          },
          {
            cat_id: 59,
            cat_name: '三门冰箱',
            cat_pid: 45,
            cat_level: 2,
            cat_deleted: false
          },
          {
            cat_id: 60,
            cat_name: '十字对开门',
            cat_pid: 45,
            cat_level: 2,
            cat_deleted: false
          },
          {
            cat_id: 61,
            cat_name: '双门冰箱',
            cat_pid: 45,
            cat_level: 2,
            cat_deleted: false
          },
          {
            cat_id: 62,
            cat_name: '冷柜/冰吧',
            cat_pid: 45,
            cat_level: 2,
            cat_deleted: false
          },
          {
            cat_id: 63,
            cat_name: '商用冷柜',
            cat_pid: 45,
            cat_level: 2,
            cat_deleted: false
          },
          {
            cat_id: 65,
            cat_name: '海尔',
            cat_pid: 45,
            cat_level: 2,
            cat_deleted: false
          },
          {
            cat_id: 66,
            cat_name: '西门子',
            cat_pid: 45,
            cat_level: 2,
            cat_deleted: false
          },
          {
            cat_id: 67,
            cat_name: '容声',
            cat_pid: 45,
            cat_level: 2,
            cat_deleted: false
          },
          {
            cat_id: 68,
            cat_name: '美菱',
            cat_pid: 45,
            cat_level: 2,
            cat_deleted: false
          },
          {
            cat_id: 1485,
            cat_name: '迪迦',
            cat_pid: 45,
            cat_level: 2,
            cat_deleted: false
          }
        ]
      }
    ]
  },
  {
    cat_id: 52,
    cat_name: '热门推荐',
    cat_pid: 0,
    cat_level: 0,
    cat_deleted: false,
    children: [
      {
        cat_id: 64,
        cat_name: '圣诞狂欢',
        cat_pid: 52,
        cat_level: 1,
        cat_deleted: false,
        children: [
          {
            cat_id: 73,
            cat_name: '护肤套装',
            cat_pid: 64,
            cat_level: 2,
            cat_deleted: false
          },
          {
            cat_id: 74,
            cat_name: '面膜',
            cat_pid: 64,
            cat_level: 2,
            cat_deleted: false
          },
          {
            cat_id: 76,
            cat_name: '巧克力',
            cat_pid: 64,
            cat_level: 2,
            cat_deleted: false
          },
          {
            cat_id: 77,
            cat_name: '儿童玩具',
            cat_pid: 64,
            cat_level: 2,
            cat_deleted: false
          },
          {
            cat_id: 78,
            cat_name: '童装童鞋',
            cat_pid: 64,
            cat_level: 2,
            cat_deleted: false
          },
          {
            cat_id: 79,
            cat_name: '平板电脑',
            cat_pid: 64,
            cat_level: 2,
            cat_deleted: false
          },
          {
            cat_id: 80,
            cat_name: '笔记本',
            cat_pid: 64,
            cat_level: 2,
            cat_deleted: false
          },
          {
            cat_id: 81,
            cat_name: '苹果手机',
            cat_pid: 64,
            cat_level: 2,
            cat_deleted: false
          },
          {
            cat_id: 82,
            cat_name: '小米手机',
            cat_pid: 64,
            cat_level: 2,
            cat_deleted: false
          },
          {
            cat_id: 83,
            cat_name: '数码相机',
            cat_pid: 64,
            cat_level: 2,
            cat_deleted: false
          },
          {
            cat_id: 84,
            cat_name: '耳机耳麦',
            cat_pid: 64,
            cat_level: 2,
            cat_deleted: false
          },
          {
            cat_id: 85,
            cat_name: '挂机空调',
            cat_pid: 64,
            cat_level: 2,
            cat_deleted: false
          },
          {
            cat_id: 86,
            cat_name: '空气净化器',
            cat_pid: 64,
            cat_level: 2,
            cat_deleted: false
          },
          {
            cat_id: 87,
            cat_name: '洗衣机',
            cat_pid: 64,
            cat_level: 2,
            cat_deleted: false
          },
          {
            cat_id: 88,
            cat_name: '4K超高清',
            cat_pid: 64,
            cat_level: 2,
            cat_deleted: false
          },
          {
            cat_id: 89,
            cat_name: '洗碗机',
            cat_pid: 64,
            cat_level: 2,
            cat_deleted: false
          }
        ]
      },
      {
        cat_id: 1008,
        cat_name: '冲锋衣',
        cat_pid: 52,
        cat_level: 2,
        cat_deleted: false
      }
    ]
  },
  {
    cat_id: 70,
    cat_name: '全球购',
    cat_pid: 0,
    cat_level: 0,
    cat_deleted: false,
    children: [
      {
        cat_id: 75,
        cat_name: '国际名牌',
        cat_pid: 70,
        cat_level: 1,
        cat_deleted: false,
        children: [
          {
            cat_id: 92,
            cat_name: 'swisse',
            cat_pid: 75,
            cat_level: 2,
            cat_deleted: false
          },
          {
            cat_id: 94,
            cat_name: '巴黎水',
            cat_pid: 75,
            cat_level: 2,
            cat_deleted: false
          },
          {
            cat_id: 95,
            cat_name: '爱他美',
            cat_pid: 75,
            cat_level: 2,
            cat_deleted: false
          },
          {
            cat_id: 97,
            cat_name: '花王',
            cat_pid: 75,
            cat_level: 2,
            cat_deleted: false
          },
          {
            cat_id: 98,
            cat_name: '戴森',
            cat_pid: 75,
            cat_level: 2,
            cat_deleted: false
          },
          {
            cat_id: 99,
            cat_name: 'ReFa',
            cat_pid: 75,
            cat_level: 2,
            cat_deleted: false
          },
          {
            cat_id: 100,
            cat_name: 'MK',
            cat_pid: 75,
            cat_level: 2,
            cat_deleted: false
          }
        ]
      },
      {
        cat_id: 93,
        cat_name: '母婴儿童',
        cat_pid: 70,
        cat_level: 1,
        cat_deleted: false,
        children: [
          {
            cat_id: 102,
            cat_name: '纸尿裤',
            cat_pid: 93,
            cat_level: 2,
            cat_deleted: false
          },
          {
            cat_id: 103,
            cat_name: '营养辅食',
            cat_pid: 93,
            cat_level: 2,
            cat_deleted: false
          },
          {
            cat_id: 104,
            cat_name: '婴儿用品',
            cat_pid: 93,
            cat_level: 2,
            cat_deleted: false
          },
          {
            cat_id: 105,
            cat_name: '婴儿洗护',
            cat_pid: 93,
            cat_level: 2,
            cat_deleted: false
          },
          {
            cat_id: 106,
            cat_name: '童车童床',
            cat_pid: 93,
            cat_level: 2,
            cat_deleted: false
          },
          {
            cat_id: 107,
            cat_name: '儿童玩具',
            cat_pid: 93,
            cat_level: 2,
            cat_deleted: false
          },
          {
            cat_id: 108,
            cat_name: '童装童鞋',
            cat_pid: 93,
            cat_level: 2,
            cat_deleted: false
          }
        ]
      },
      {
        cat_id: 96,
        cat_name: '美妆',
        cat_pid: 70,
        cat_level: 1,
        cat_deleted: false,
        children: [
          {
            cat_id: 110,
            cat_name: '面膜',
            cat_pid: 96,
            cat_level: 2,
            cat_deleted: false
          },
          {
            cat_id: 111,
            cat_name: '口红',
            cat_pid: 96,
            cat_level: 2,
            cat_deleted: false
          },
          {
            cat_id: 112,
            cat_name: '彩妆',
            cat_pid: 96,
            cat_level: 2,
            cat_deleted: false
          },
          {
            cat_id: 114,
            cat_name: '护肤套装',
            cat_pid: 96,
            cat_level: 2,
            cat_deleted: false
          },
          {
            cat_id: 116,
            cat_name: '香水香氛',
            cat_pid: 96,
            cat_level: 2,
            cat_deleted: false
          },
          {
            cat_id: 117,
            cat_name: '洁面仪',
            cat_pid: 96,
            cat_level: 2,
            cat_deleted: false
          },
          {
            cat_id: 118,
            cat_name: '卸妆',
            cat_pid: 96,
            cat_level: 2,
            cat_deleted: false
          }
        ]
      },
      {
        cat_id: 113,
        cat_name: '个护',
        cat_pid: 70,
        cat_level: 1,
        cat_deleted: false,
        children: [
          {
            cat_id: 120,
            cat_name: '美发护发',
            cat_pid: 113,
            cat_level: 2,
            cat_deleted: false
          },
          {
            cat_id: 121,
            cat_name: '美甲',
            cat_pid: 113,
            cat_level: 2,
            cat_deleted: false
          },
          {
            cat_id: 122,
            cat_name: '口腔护理',
            cat_pid: 113,
            cat_level: 2,
            cat_deleted: false
          },
          {
            cat_id: 123,
            cat_name: '女性护理',
            cat_pid: 113,
            cat_level: 2,
            cat_deleted: false
          }
        ]
      },
      {
        cat_id: 115,
        cat_name: '营养保健',
        cat_pid: 70,
        cat_level: 1,
        cat_deleted: false,
        children: [
          {
            cat_id: 125,
            cat_name: '提高免疫',
            cat_pid: 115,
            cat_level: 2,
            cat_deleted: false
          },
          {
            cat_id: 126,
            cat_name: '维生素/矿物质',
            cat_pid: 115,
            cat_level: 2,
            cat_deleted: false
          },
          {
            cat_id: 127,
            cat_name: '美容养颜',
            cat_pid: 115,
            cat_level: 2,
            cat_deleted: false
          },
          {
            cat_id: 129,
            cat_name: '调节三高',
            cat_pid: 115,
            cat_level: 2,
            cat_deleted: false
          },
          {
            cat_id: 130,
            cat_name: '减肥瘦身',
            cat_pid: 115,
            cat_level: 2,
            cat_deleted: false
          },
          {
            cat_id: 131,
            cat_name: '胶原蛋白',
            cat_pid: 115,
            cat_level: 2,
            cat_deleted: false
          },
          {
            cat_id: 132,
            cat_name: '补肾强身',
            cat_pid: 115,
            cat_level: 2,
            cat_deleted: false
          },
          {
            cat_id: 134,
            cat_name: '养生茶饮',
            cat_pid: 115,
            cat_level: 2,
            cat_deleted: false
          }
        ]
      },
      {
        cat_id: 128,
        cat_name: '食品',
        cat_pid: 70,
        cat_level: 1,
        cat_deleted: false,
        children: [
          {
            cat_id: 136,
            cat_name: '牛奶乳品',
            cat_pid: 128,
            cat_level: 2,
            cat_deleted: false
          },
          {
            cat_id: 137,
            cat_name: '方便速食',
            cat_pid: 128,
            cat_level: 2,
            cat_deleted: false
          },
          {
            cat_id: 138,
            cat_name: '进口酒水',
            cat_pid: 128,
            cat_level: 2,
            cat_deleted: false
          },
          {
            cat_id: 139,
            cat_name: '进口粮油',
            cat_pid: 128,
            cat_level: 2,
            cat_deleted: false
          },
          {
            cat_id: 140,
            cat_name: '厨房调料',
            cat_pid: 128,
            cat_level: 2,
            cat_deleted: false
          }
        ]
      },
      {
        cat_id: 133,
        cat_name: '数码家电',
        cat_pid: 70,
        cat_level: 1,
        cat_deleted: false,
        children: [
          {
            cat_id: 142,
            cat_name: '平板电脑',
            cat_pid: 133,
            cat_level: 2,
            cat_deleted: false
          },
          {
            cat_id: 143,
            cat_name: '笔记本电脑',
            cat_pid: 133,
            cat_level: 2,
            cat_deleted: false
          },
          {
            cat_id: 144,
            cat_name: '手机配件',
            cat_pid: 133,
            cat_level: 2,
            cat_deleted: false
          },
          {
            cat_id: 145,
            cat_name: '音箱音响',
            cat_pid: 133,
            cat_level: 2,
            cat_deleted: false
          },
          {
            cat_id: 146,
            cat_name: '摄影摄像',
            cat_pid: 133,
            cat_level: 2,
            cat_deleted: false
          },
          {
            cat_id: 147,
            cat_name: '智能设备',
            cat_pid: 133,
            cat_level: 2,
            cat_deleted: false
          },
          {
            cat_id: 148,
            cat_name: '剃须刀',
            cat_pid: 133,
            cat_level: 2,
            cat_deleted: false
          },
          {
            cat_id: 149,
            cat_name: '吸尘器',
            cat_pid: 133,
            cat_level: 2,
            cat_deleted: false
          },
          {
            cat_id: 150,
            cat_name: '电饭煲',
            cat_pid: 133,
            cat_level: 2,
            cat_deleted: false
          },
          {
            cat_id: 152,
            cat_name: '电吹风',
            cat_pid: 133,
            cat_level: 2,
            cat_deleted: false
          },
          {
            cat_id: 153,
            cat_name: '咖啡机',
            cat_pid: 133,
            cat_level: 2,
            cat_deleted: false
          },
          {
            cat_id: 154,
            cat_name: '空气净化器',
            cat_pid: 133,
            cat_level: 2,
            cat_deleted: false
          },
          {
            cat_id: 155,
            cat_name: '美容仪',
            cat_pid: 133,
            cat_level: 2,
            cat_deleted: false
          },
          {
            cat_id: 156,
            cat_name: '电动牙刷',
            cat_pid: 133,
            cat_level: 2,
            cat_deleted: false
          }
        ]
      },
      {
        cat_id: 151,
        cat_name: '服饰箱包',
        cat_pid: 70,
        cat_level: 1,
        cat_deleted: false,
        children: [
          {
            cat_id: 159,
            cat_name: '潮流女包',
            cat_pid: 151,
            cat_level: 2,
            cat_deleted: false
          },
          {
            cat_id: 160,
            cat_name: '钟表眼镜',
            cat_pid: 151,
            cat_level: 2,
            cat_deleted: false
          },
          {
            cat_id: 161,
            cat_name: '男装',
            cat_pid: 151,
            cat_level: 2,
            cat_deleted: false
          },
          {
            cat_id: 162,
            cat_name: '女装',
            cat_pid: 151,
            cat_level: 2,
            cat_deleted: false
          },
          {
            cat_id: 163,
            cat_name: '配饰',
            cat_pid: 151,
            cat_level: 2,
            cat_deleted: false
          },
          {
            cat_id: 164,
            cat_name: '男鞋',
            cat_pid: 151,
            cat_level: 2,
            cat_deleted: false
          },
          {
            cat_id: 165,
            cat_name: '女鞋',
            cat_pid: 151,
            cat_level: 2,
            cat_deleted: false
          },
          {
            cat_id: 166,
            cat_name: '运动鞋',
            cat_pid: 151,
            cat_level: 2,
            cat_deleted: false
          },
          {
            cat_id: 167,
            cat_name: '功能箱包',
            cat_pid: 151,
            cat_level: 2,
            cat_deleted: false
          },
          {
            cat_id: 168,
            cat_name: '珠宝饰品',
            cat_pid: 151,
            cat_level: 2,
            cat_deleted: false
          },
          {
            cat_id: 169,
            cat_name: '内衣',
            cat_pid: 151,
            cat_level: 2,
            cat_deleted: false
          }
        ]
      },
      {
        cat_id: 157,
        cat_name: '家居日用',
        cat_pid: 70,
        cat_level: 1,
        cat_deleted: false,
        children: [
          {
            cat_id: 171,
            cat_name: '生活日用',
            cat_pid: 157,
            cat_level: 2,
            cat_deleted: false
          },
          {
            cat_id: 175,
            cat_name: '餐厨用具',
            cat_pid: 157,
            cat_level: 2,
            cat_deleted: false
          },
          {
            cat_id: 177,
            cat_name: '清洁用品',
            cat_pid: 157,
            cat_level: 2,
            cat_deleted: false
          },
          {
            cat_id: 179,
            cat_name: '安全避孕',
            cat_pid: 157,
            cat_level: 2,
            cat_deleted: false
          },
          {
            cat_id: 180,
            cat_name: '情趣用品',
            cat_pid: 157,
            cat_level: 2,
            cat_deleted: false
          }
        ]
      }
    ]
  },
  {
    cat_id: 172,
    cat_name: '苏宁房产',
    cat_pid: 0,
    cat_level: 0,
    cat_deleted: false,
    children: [
      {
        cat_id: 173,
        cat_name: '苏宁房产',
        cat_pid: 172,
        cat_level: 1,
        cat_deleted: false,
        children: [
          {
            cat_id: 183,
            cat_name: '恒大旅游',
            cat_pid: 173,
            cat_level: 2,
            cat_deleted: false
          }
        ]
      },
      {
        cat_id: 181,
        cat_name: '苏宁置业',
        cat_pid: 172,
        cat_level: 2,
        cat_deleted: false
      }
    ]
  },
  {
    cat_id: 174,
    cat_name: '手机相机',
    cat_pid: 0,
    cat_level: 0,
    cat_deleted: false,
    children: [
      {
        cat_id: 178,
        cat_name: '大牌推荐',
        cat_pid: 174,
        cat_level: 1,
        cat_deleted: false,
        children: [
          {
            cat_id: 187,
            cat_name: '荣耀',
            cat_pid: 178,
            cat_level: 2,
            cat_deleted: false
          },
          {
            cat_id: 188,
            cat_name: '华为',
            cat_pid: 178,
            cat_level: 2,
            cat_deleted: false
          },
          {
            cat_id: 189,
            cat_name: '三星',
            cat_pid: 178,
            cat_level: 2,
            cat_deleted: false
          },
          {
            cat_id: 190,
            cat_name: '魅族',
            cat_pid: 178,
            cat_level: 2,
            cat_deleted: false
          },
          {
            cat_id: 191,
            cat_name: 'OPPO',
            cat_pid: 178,
            cat_level: 2,
            cat_deleted: false
          },
          {
            cat_id: 192,
            cat_name: 'vivo',
            cat_pid: 178,
            cat_level: 2,
            cat_deleted: false
          },
          {
            cat_id: 193,
            cat_name: '努比亚',
            cat_pid: 178,
            cat_level: 2,
            cat_deleted: false
          },
          {
            cat_id: 194,
            cat_name: '美图',
            cat_pid: 178,
            cat_level: 2,
            cat_deleted: false
          },
          {
            cat_id: 195,
            cat_name: '诺基亚',
            cat_pid: 178,
            cat_level: 2,
            cat_deleted: false
          },
          {
            cat_id: 196,
            cat_name: '飞利浦',
            cat_pid: 178,
            cat_level: 2,
            cat_deleted: false
          }
        ]
      },
      {
        cat_id: 185,
        cat_name: '搞机达人',
        cat_pid: 174,
        cat_level: 1,
        cat_deleted: false,
        children: [
          {
            cat_id: 198,
            cat_name: '拍照手机',
            cat_pid: 185,
            cat_level: 2,
            cat_deleted: false
          },
          {
            cat_id: 200,
            cat_name: '游戏手机',
            cat_pid: 185,
            cat_level: 2,
            cat_deleted: false
          },
          {
            cat_id: 201,
            cat_name: '好评过万',
            cat_pid: 185,
            cat_level: 2,
            cat_deleted: false
          },
          {
            cat_id: 202,
            cat_name: '全面屏手机',
            cat_pid: 185,
            cat_level: 2,
            cat_deleted: false
          },
          {
            cat_id: 203,
            cat_name: '大屏手机',
            cat_pid: 185,
            cat_level: 2,
            cat_deleted: false
          },
          {
            cat_id: 204,
            cat_name: '老人机',
            cat_pid: 185,
            cat_level: 2,
            cat_deleted: false
          },
          {
            cat_id: 205,
            cat_name: '长续航手机',
            cat_pid: 185,
            cat_level: 2,
            cat_deleted: false
          },
          {
            cat_id: 206,
            cat_name: '指纹手机',
            cat_pid: 185,
            cat_level: 2,
            cat_deleted: false
          }
        ]
      },
      {
        cat_id: 199,
        cat_name: '手机配件',
        cat_pid: 174,
        cat_level: 1,
        cat_deleted: false,
        children: [
          {
            cat_id: 209,
            cat_name: '移动电源',
            cat_pid: 199,
            cat_level: 2,
            cat_deleted: false
          },
          {
            cat_id: 210,
            cat_name: '苹果周边',
            cat_pid: 199,
            cat_level: 2,
            cat_deleted: false
          },
          {
            cat_id: 212,
            cat_name: '手机耳机',
            cat_pid: 199,
            cat_level: 2,
            cat_deleted: false
          },
          {
            cat_id: 213,
            cat_name: '充电器',
            cat_pid: 199,
            cat_level: 2,
            cat_deleted: false
          },
          {
            cat_id: 214,
            cat_name: '手机膜',
            cat_pid: 199,
            cat_level: 2,
            cat_deleted: false
          },
          {
            cat_id: 215,
            cat_name: '数据线',
            cat_pid: 199,
            cat_level: 2,
            cat_deleted: false
          },
          {
            cat_id: 216,
            cat_name: '手机存储卡',
            cat_pid: 199,
            cat_level: 2,
            cat_deleted: false
          },
          {
            cat_id: 217,
            cat_name: '手机壳',
            cat_pid: 199,
            cat_level: 2,
            cat_deleted: false
          },
          {
            cat_id: 218,
            cat_name: '自拍杆',
            cat_pid: 199,
            cat_level: 2,
            cat_deleted: false
          },
          {
            cat_id: 219,
            cat_name: '手机支架',
            cat_pid: 199,
            cat_level: 2,
            cat_deleted: false
          },
          {
            cat_id: 220,
            cat_name: '手机U盘',
            cat_pid: 199,
            cat_level: 2,
            cat_deleted: false
          }
        ]
      },
      {
        cat_id: 207,
        cat_name: '手机服务',
        cat_pid: 174,
        cat_level: 1,
        cat_deleted: false,
        children: [
          {
            cat_id: 222,
            cat_name: '手机维修',
            cat_pid: 207,
            cat_level: 2,
            cat_deleted: false
          },
          {
            cat_id: 224,
            cat_name: '二手优品',
            cat_pid: 207,
            cat_level: 2,
            cat_deleted: false
          }
        ]
      },
      {
        cat_id: 211,
        cat_name: '运营商',
        cat_pid: 174,
        cat_level: 1,
        cat_deleted: false,
        children: [
          {
            cat_id: 226,
            cat_name: '话费充值',
            cat_pid: 211,
            cat_level: 2,
            cat_deleted: false
          },
          {
            cat_id: 227,
            cat_name: '流量订购',
            cat_pid: 211,
            cat_level: 2,
            cat_deleted: false
          },
          {
            cat_id: 228,
            cat_name: '苏宁网厅',
            cat_pid: 211,
            cat_level: 2,
            cat_deleted: false
          },
          {
            cat_id: 229,
            cat_name: '超值靓号',
            cat_pid: 211,
            cat_level: 2,
            cat_deleted: false
          }
        ]
      },
      {
        cat_id: 223,
        cat_name: '摄影摄像',
        cat_pid: 174,
        cat_level: 1,
        cat_deleted: false,
        children: [
          {
            cat_id: 231,
            cat_name: '微单相机',
            cat_pid: 223,
            cat_level: 2,
            cat_deleted: false
          },
          {
            cat_id: 232,
            cat_name: '数码相机',
            cat_pid: 223,
            cat_level: 2,
            cat_deleted: false
          },
          {
            cat_id: 233,
            cat_name: '摄像机',
            cat_pid: 223,
            cat_level: 2,
            cat_deleted: false
          },
          {
            cat_id: 234,
            cat_name: '航拍无人机',
            cat_pid: 223,
            cat_level: 2,
            cat_deleted: false
          },
          {
            cat_id: 235,
            cat_name: '镜头',
            cat_pid: 223,
            cat_level: 2,
            cat_deleted: false
          },
          {
            cat_id: 236,
            cat_name: '拍立得',
            cat_pid: 223,
            cat_level: 2,
            cat_deleted: false
          },
          {
            cat_id: 237,
            cat_name: '运动相机',
            cat_pid: 223,
            cat_level: 2,
            cat_deleted: false
          },
          {
            cat_id: 238,
            cat_name: '佳能',
            cat_pid: 223,
            cat_level: 2,
            cat_deleted: false
          },
          {
            cat_id: 239,
            cat_name: '尼康',
            cat_pid: 223,
            cat_level: 2,
            cat_deleted: false
          },
          {
            cat_id: 240,
            cat_name: '索尼',
            cat_pid: 223,
            cat_level: 2,
            cat_deleted: false
          },
          {
            cat_id: 241,
            cat_name: '富士',
            cat_pid: 223,
            cat_level: 2,
            cat_deleted: false
          },
          {
            cat_id: 242,
            cat_name: 'JVC',
            cat_pid: 223,
            cat_level: 2,
            cat_deleted: false
          },
          {
            cat_id: 243,
            cat_name: '宾得',
            cat_pid: 223,
            cat_level: 2,
            cat_deleted: false
          },
          {
            cat_id: 244,
            cat_name: '奥林巴斯',
            cat_pid: 223,
            cat_level: 2,
            cat_deleted: false
          },
          {
            cat_id: 245,
            cat_name: '柯达',
            cat_pid: 223,
            cat_level: 2,
            cat_deleted: false
          },
          {
            cat_id: 247,
            cat_name: '徕卡',
            cat_pid: 223,
            cat_level: 2,
            cat_deleted: false
          },
          {
            cat_id: 248,
            cat_name: '松下',
            cat_pid: 223,
            cat_level: 2,
            cat_deleted: false
          },
          {
            cat_id: 249,
            cat_name: '喜爱',
            cat_pid: 223,
            cat_level: 2,
            cat_deleted: false
          }
        ]
      },
      {
        cat_id: 246,
        cat_name: '相机配件',
        cat_pid: 174,
        cat_level: 1,
        cat_deleted: false,
        children: [
          {
            cat_id: 251,
            cat_name: '三脚架',
            cat_pid: 246,
            cat_level: 2,
            cat_deleted: false
          },
          {
            cat_id: 252,
            cat_name: '数据线',
            cat_pid: 246,
            cat_level: 2,
            cat_deleted: false
          },
          {
            cat_id: 253,
            cat_name: '滤镜',
            cat_pid: 246,
            cat_level: 2,
            cat_deleted: false
          },
          {
            cat_id: 254,
            cat_name: '相机存储卡',
            cat_pid: 246,
            cat_level: 2,
            cat_deleted: false
          },
          {
            cat_id: 255,
            cat_name: '闪光灯',
            cat_pid: 246,
            cat_level: 2,
            cat_deleted: false
          },
          {
            cat_id: 256,
            cat_name: '三星',
            cat_pid: 246,
            cat_level: 2,
            cat_deleted: false
          },
          {
            cat_id: 257,
            cat_name: '影棚器材',
            cat_pid: 246,
            cat_level: 2,
            cat_deleted: false
          },
          {
            cat_id: 258,
            cat_name: '国家地理',
            cat_pid: 246,
            cat_level: 2,
            cat_deleted: false
          },
          {
            cat_id: 259,
            cat_name: '腾龙',
            cat_pid: 246,
            cat_level: 2,
            cat_deleted: false
          },
          {
            cat_id: 260,
            cat_name: '适马',
            cat_pid: 246,
            cat_level: 2,
            cat_deleted: false
          },
          {
            cat_id: 261,
            cat_name: '英特迈',
            cat_pid: 246,
            cat_level: 2,
            cat_deleted: false
          },
          {
            cat_id: 262,
            cat_name: '品胜',
            cat_pid: 246,
            cat_level: 2,
            cat_deleted: false
          },
          {
            cat_id: 263,
            cat_name: '百诺',
            cat_pid: 246,
            cat_level: 2,
            cat_deleted: false
          },
          {
            cat_id: 264,
            cat_name: '金士顿',
            cat_pid: 246,
            cat_level: 2,
            cat_deleted: false
          },
          {
            cat_id: 265,
            cat_name: '闪迪',
            cat_pid: 246,
            cat_level: 2,
            cat_deleted: false
          },
          {
            cat_id: 266,
            cat_name: '肯高',
            cat_pid: 246,
            cat_level: 2,
            cat_deleted: false
          },
          {
            cat_id: 267,
            cat_name: '曼富图',
            cat_pid: 246,
            cat_level: 2,
            cat_deleted: false
          },
          {
            cat_id: 268,
            cat_name: '卡色',
            cat_pid: 246,
            cat_level: 2,
            cat_deleted: false
          },
          {
            cat_id: 269,
            cat_name: '神牛',
            cat_pid: 246,
            cat_level: 2,
            cat_deleted: false
          },
          {
            cat_id: 272,
            cat_name: '思锐',
            cat_pid: 246,
            cat_level: 2,
            cat_deleted: false
          },
          {
            cat_id: 274,
            cat_name: '施耐德',
            cat_pid: 246,
            cat_level: 2,
            cat_deleted: false
          },
          {
            cat_id: 275,
            cat_name: '金贝',
            cat_pid: 246,
            cat_level: 2,
            cat_deleted: false
          },
          {
            cat_id: 276,
            cat_name: '飞毛腿',
            cat_pid: 246,
            cat_level: 2,
            cat_deleted: false
          },
          {
            cat_id: 277,
            cat_name: '耐司',
            cat_pid: 246,
            cat_level: 2,
            cat_deleted: false
          },
          {
            cat_id: 278,
            cat_name: '沣标',
            cat_pid: 246,
            cat_level: 2,
            cat_deleted: false
          },
          {
            cat_id: 279,
            cat_name: '迪比科',
            cat_pid: 246,
            cat_level: 2,
            cat_deleted: false
          },
          {
            cat_id: 280,
            cat_name: '斯丹德',
            cat_pid: 246,
            cat_level: 2,
            cat_deleted: false
          }
        ]
      }
    ]
  }
])
// 商品分类的总数
const total = ref(0)
// 添加分类的表单数据对象
const { addCateForm } = reactive({
  addCateForm: {
    cat_pid: 0,
    cat_name: '',
    cat_level: 0
  }
})

// 请求到的父级分类数据列表
const list = reactive({ parentCateList: [] })
// 请求当前编辑分类的表单数据对象
const editForm = reactive({ editCateForm: {} })

// 级联选择器配置
const cascaderProps = reactive({
  expandTrigger: 'hover',
  checkStrictly: true,
  value: 'cat_id',
  label: 'cat_name',
  children: 'children'
})
// 选中的父级分类的 id 数组
const selKeys = reactive({ selectedKeys: [] })
// console.log(selKeys)
// 添加分类的表单验证规则
// 编辑分类的表单验证规则
const addCateFormRules = {
  cat_name: [
    { required: true, message: '请输入分类', trigger: 'blur' }
  ]
}
// 获取商品数据列表
const getCateList = async () => {
  const { data } = await proxy.$http.get('categories', { params: queryInfo })
  if (data.meta.status !== 200) return proxy.$message.error('请求商品分类数据失败')
  // console.log(data)
  clist.cateList = data.data.result
  total.value = data.data.total
}
getCateList()
// 获取父级分类数据列表
const getParentCateList = async () => {
  const { data } = await proxy.$http.get('categories', {
    params: {
      type: 2
    }
  })
  if (data.meta.status !== 200) return proxy.$message.error('请求父级分类数据列表失败')
  // console.log(data.data)
  list.parentCateList = data.data
  // console.log(list)
}

// 控制添加分类对话框的显示与隐藏
const addCateDialogVisible = ref(false)
// 控制编辑分类对话框的显示与隐藏
const editCateDialogVisible = ref(false)

// 监听pagesizes点击事件
const handleSizeChange = (newSize) => {
  queryInfo.pagesize = newSize
  getCateList()
}
// 监听pagenum点击事件
const handleCurrentChange = (newPage) => {
  queryInfo.pagenum = newPage
  getCateList()
}
// 监听添加按钮点击显示对话框
const handleAddClick = () => {
  getParentCateList()
  addCateDialogVisible.value = true
}
// 监听编辑按钮点击显示对话框
const handleEditClick = async (id) => {
  // console.log(id)
  const { data } = await proxy.$http.get(`categories/${id}`)
  if (data.meta.status !== 200) return proxy.$message.error('获取分类数据失败')
  // console.log(data)
  editForm.editCateForm = data.data
  // console.log(editForm.editCateForm)
  editCateDialogVisible.value = true
}
// 监听选项变化触发事件
const handleChange = () => {
  // console.log(selKeys)
  if (selKeys.selectedKeys === null) return
  if (selKeys.selectedKeys.length > 0) {
    addCateForm.cat_pid = selKeys.selectedKeys[selKeys.selectedKeys.length - 1]
    // 为当前分类的等级赋值
    addCateForm.cat_level = selKeys.selectedKeys.length
    // console.log(addCateForm)
  } else {
    addCateForm.cat_pid = 0
    addCateForm.cat_level = 0
  }
}
// 监听添加分类对话框确认事件
const addCateConfirm = () => {
  proxy.$refs.addCateFormRef.validate(async (valid) => {
    if (!valid) return proxy.$message.error('请添加分类')
    const { data } = await proxy.$http.post('categories', addCateForm)
    if (data.meta.status !== 201) return proxy.$message.error('添加分类失败')
    proxy.$message.success('添加分类成功')
    getCateList()
    addCateDialogVisible.value = false
  })
}
// 监听编辑分类对话框确认事件
const editDialogConfirm = () => {
  proxy.$refs.editCateFormRef.validate(async (valid) => {
    if (!valid) return proxy.$message.error('请输入合法分类')
    const { data } = await proxy.$http.put(`categories/${editForm.editCateForm.cat_id}`, {
      cat_name: editForm.editCateForm.cat_name
    })
    if (data.meta.status !== 200) return proxy.$message.error('更新分类失败')
    proxy.$message.success('更新分类成功')
    getCateList()
    editCateDialogVisible.value = false
  })
}
// 监听添加分类对话框关闭事件
const addCateDialogClose = () => {
  proxy.$refs.addCateFormRef.resetFields()
  selKeys.selectedKeys = null
  addCateForm.cat_pid = 0
  addCateForm.cat_level = 0
  // console.log(selKeys)
}
// 监听编辑分类对话框关闭事件
const editCateDialogClose = () => {
  proxy.$refs.editCateFormRef.resetFields()
}
// 监听删除按钮点击事件
const handleDeleteClick = async (id) => {
  const res = await proxy.$confirm('该操作不可逆，确定删除当前分类吗', '警告', {
    confirmButtonText: '删吧',
    cancelButtonText: '不了吧',
    type: 'warning'
  }).catch(error => error)
  if (res === 'confirm') {
    const { data } = await proxy.$http.delete(`categories/${id}`)
    if (data.meta.status !== 200) return proxy.$message.error('删除分类失败')
    proxy.$message.success('删除分类成功')
    getCateList()
  }
}
</script>

<style lang="less" scoped>
/deep/.el-cascader {
  display: block;
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
.margin {
  margin: 10px;
}
</style>
