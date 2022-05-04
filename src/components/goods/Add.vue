<template>
  <!-- 面包屑导航区 -->
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>商品管理</el-breadcrumb-item>
    <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    <el-breadcrumb-item>添加商品</el-breadcrumb-item>
  </el-breadcrumb>
  <!-- 卡片视图 -->
  <el-card>
    <el-alert title="添加商品信息" type="info" center show-icon :closable="false"/>
    <el-steps :space="200" :active="active - 0" finish-status="success" align-center class="margin">
      <el-step title="基本信息" />
      <el-step title="商品参数" />
      <el-step title="商品属性" />
      <el-step title="商品图片" />
      <el-step title="商品内容" />
      <el-step title="完成" />
    </el-steps>
    <!-- tab栏区域 -->
    <el-form
      :model="list.addForm"
      :rules="addFormRules"
      ref="addFormRef"
      label-width="100px"
      label-position="top"
    >
      <el-tabs
        v-model="active"
        tab-position="left"
        class="demo-tabs"
        :before-leave="beforeTabLeave"
        @tab-click="handleTabClick"
      >
        <el-tab-pane label="基本信息" name="0">
          <el-form-item label="商品名称" prop="goods_name">
            <el-input v-model="list.addForm.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品价格" prop="goods_price">
            <el-input v-model="list.addForm.goods_price" type="number"></el-input>
          </el-form-item>
          <el-form-item label="商品重量" prop="goods_weight">
            <el-input v-model="list.addForm.goods_weight" type="number"></el-input>
          </el-form-item>
          <el-form-item label="商品数量" prop="goods_number">
            <el-input v-model="list.addForm.goods_number" type="number"></el-input>
          </el-form-item>
          <el-form-item label="商品分类" prop="goods_cat">
            <el-cascader
              v-model="list.addForm.goods_cat"
              :options="list.cateList"
              :props="Props"
              @change="handleChange"
              clearable
            />
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品参数" name="1">
          <el-form-item
            :label="item.attr_name"
            v-for="item in list.manyTableData"
            :key="item.attr_id"
          >
            <el-checkbox-group v-model="item.attr_vals">
              <el-checkbox
                :label="item2"
                v-for="(item2, index2) in item.attr_vals"
                :key="index2"
                border
              />
            </el-checkbox-group>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品属性" name="2">
          <el-form-item
            :label="item.attr_name"
            v-for="item in list.onlyTableData"
            :key="item.attr_id"
          >
            <el-input v-model="item.attr_vals"></el-input>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品图片" name="3">
          <el-upload
            :action="actionURL"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            list-type="picture"
            :headers="headers"
            :on-success="handleSuccess"
            :on-error="handleError"
          >
            <el-button type="primary">点击上传图片</el-button>
            <template #tip>
              <div class="el-upload__tip">
                jpg/png格式图片, 大小在500kb以内
              </div>
            </template>
          </el-upload>
        </el-tab-pane>
        <el-tab-pane label="商品内容" name="4">
          <!-- 富文本编辑器 -->
          <QuillEditor
            theme="snow"
            toolbar="full"
            v-model:content="list.addForm.goods_introduce"
            contentType="text"
          />
          <el-button type="primary" @click="addGoodsClick">添加商品</el-button>
        </el-tab-pane>
      </el-tabs>
    </el-form>
  </el-card>
  <!-- 图片预览对话框 -->
  <el-dialog
    title="图片预览"
    v-model="previewDialogVisible"
    width="50%"
  >
    <img :src="list.previewPath" alt="预览图" class="width">
  </el-dialog>
</template>

<script setup>
import { getCurrentInstance, reactive, ref } from 'vue'
const { proxy } = getCurrentInstance()
const active = ref('0')
const list = reactive({
  // 添加商品的表单数据对象
  addForm: {
    goods_name: '',
    goods_price: '',
    goods_weight: '',
    goods_number: '',
    // 商品所属的分类数组
    goods_cat: [],
    // 上传图片的临时路径
    pics: [],
    // 商品的详情描述
    goods_introduce: '',
    attrs: []
  },
  // 商品参数列表
  manyTableData: [],
  // 商品属性列表
  onlyTableData: [],
  cateList: [],
  SelectedKeys: [],
  previewPath: ''
})
// 图片上传的请求头
const headers = {
  Authorization: window.sessionStorage.getItem('token')
}
// 上传图片的地址
const actionURL = ref('http://127.0.0.1:8888/api/private/v1/upload')
// 控制图片预览对话框的显示与隐藏
const previewDialogVisible = ref(false)
// 级联选择器配置
const Props = reactive({
  expandTrigger: 'hover',
  value: 'cat_id',
  label: 'cat_name',
  children: 'children'
})
// 添加商品表单的验证规则
const addFormRules = {
  goods_name: [
    { required: true, message: '请输入商品名称', trigger: 'blur' }
  ],
  goods_price: [
    { required: true, message: '请输入商品价格', trigger: 'blur' }
  ],
  goods_weight: [
    { required: true, message: '请输入商品重量', trigger: 'blur' }
  ],
  goods_number: [
    { required: true, message: '请输入商品数量', trigger: 'blur' }
  ],
  goods_cat: [
    { required: true, message: '请选择商品分类', trigger: 'blur' }
  ]
}

// 获取商品分类数据列表
const getCateList = async () => {
  const { data } = await proxy.$http.get('categories')
  if (data.meta.status !== 200) return proxy.$message.error('获取商品分类数据列表失败')
  list.cateList = data.data
  // console.log(list.cateList)
}
getCateList()
// 级联选择器改变事件
const handleChange = () => {
  // console.log(list.addForm.goods_cat)
  if (list.addForm.goods_cat === null) return
  if (list.addForm.goods_cat.length !== 3) {
    list.addForm.goods_cat = []
  }
}
// 切换标签页之前的钩子函数
const beforeTabLeave = (activeName, oldActiveName) => {
  if (list.addForm.goods_cat === null) {
    proxy.$message.error('请选择商品分类')
    return false
  } else if (oldActiveName === '0' && list.addForm.goods_cat.length !== 3) {
    proxy.$message.error('请选择商品分类')
    return false
  }
}
// tab标签选中触发事件
const handleTabClick = async () => {
  switch (active.value) {
    case '1': {
      const { data } = await proxy.$http.get(`categories/${list.addForm.goods_cat[2]}/attributes`, {
        params: {
          sel: 'many'
        }
      })
      if (data.meta.status !== 200) return proxy.$message.error('获取商品参数列表失败')
      data.data.forEach(item => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
      })
      // console.log(data.data)
      list.manyTableData = data.data
    }; break
    case '2': {
      const { data } = await proxy.$http.get(`categories/${list.addForm.goods_cat[2]}/attributes`, {
        params: {
          sel: 'only'
        }
      })
      if (data.meta.status !== 200) return proxy.$message.error('获取商品属性列表失败')
      // data.data.forEach(item => {
      //   item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
      // })
      // console.log(data.data)
      list.onlyTableData = data.data
    };break
  }
}
// 图片预览事件
const handlePreview = (file) => {
  console.log(file)
  list.previewPath = file.response.data.url
  previewDialogVisible.value = true
}
// 图片移除事件
const handleRemove = (file) => {
  console.log(file)
  const filePath = file.response.data.tmp_path
  const i = list.addForm.pics.findIndex(x => {
    return x.pic === filePath
  })
  list.addForm.pics.splice(i, 1)
  console.log(list.addForm)
}
// 图片上传成功的事件
const handleSuccess = (response) => {
  // console.log(response)
  const picInfo = { pic: response.data.tmp_path }
  list.addForm.pics.push(picInfo)
  // console.log(list.addForm)
  proxy.$message.success('上传图片成功')
}
// 图片上传失败的事件
const handleError = () => {
  proxy.$message.error('上传图片失败')
}
// 添加商品按钮点击事件
const addGoodsClick = () => {
  // console.log(list.addForm)
  proxy.$refs.addFormRef.validate(async (valid) => {
    if (!valid) return proxy.$message.error('有必填项遗漏，请填写完整信息')
    const newAddForm = JSON.parse(JSON.stringify(list.addForm))
    // 将数组转为字符串
    newAddForm.goods_cat = newAddForm.goods_cat.join(',')
    // console.log(newAddForm)
    // 处理动态参数
    list.manyTableData.forEach(item => {
      const newInfo = {
        attr_id: item.attr_id,
        attr_value: item.attr_vals.join(' ')
      }
      newAddForm.attrs.push(newInfo)
    })
    // 处理静态属性
    list.onlyTableData.forEach(item => {
      const newInfo = {
        attr_id: item.attr_id,
        attr_value: item.attr_vals
      }
      newAddForm.attrs.push(newInfo)
    })
    // console.log(newAddForm)
    const { data } = await proxy.$http.post('goods', newAddForm)
    if (data.meta.status !== 201) return proxy.$message.error('添加商品失败')
    proxy.$message.success('添加商品成功')
    proxy.$router.push('/goods')
  })
}
</script>

<style lang="less" scoped>
.margin {
  margin-top: 15px;
}
/deep/.el-step__title {
  font-size: 13px;
}
.el-checkbox {
  margin: 0 10px 0 0 !important;
}
.width {
  width: 100%;
}
/deep/.ql-container {
  height: 300px;
  margin-bottom: 15px;
}
</style>
