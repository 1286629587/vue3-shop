<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像区域 -->
      <div class="avatar_box">
        <img src="../assets/logo.png" alt="头像">
      </div>
      <!-- 登录表单区域 -->
      <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginFormRules"
        label-width="0px"
        class="login_form"

      >
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input
            class="w-50 m-2"
            prefix-icon="el-icon-user"
            v-model="loginForm.username"
          />
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input
            type="password"
            class="w-50 m-2"
            prefix-icon="el-icon-key"
            v-model="loginForm.password"
          />
        </el-form-item>
        <!-- 按钮区 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="login(loginFormRef)">登录</el-button>
          <el-button type="info" @click="resetLoginForm(loginFormRef)">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { getCurrentInstance, reactive, ref } from 'vue'
// 这是登录表单的绑定数据
const loginForm = reactive({
  username: 'admin',
  password: '123456'
})
// 这是表单的验证规则对象
const loginFormRules = reactive({
  // 验证用户名是否合法
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
  ],
  // 验证密码是否合法
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
  ]
})
// 当前表单的实例对象
const loginFormRef = ref('')
// 点击重置按钮，重置登录表单
const resetLoginForm = (formEl) => {
  formEl.resetFields()
}
// 点击登录按钮，对表单进行验证
const { proxy } = getCurrentInstance()
// console.log(proxy)
const login = async (formEl) => {
  await formEl.validate(async (valid) => {
    if (!valid) return
    // console.log(valid)
    const { data } = await proxy.$http.post('login', loginForm)
    // console.log(data.meta)
    if (data.meta.status !== 200) return proxy.$message.error('用户名或密码错误')
    proxy.$message.success('登录成功')
    // 1. 将登录成功之后的 token，保存到客户端的 sessionStorage 中
    //   1.1 项目中除了登录之外的其他api接口，必须在登录之后才能访问
    //   1.2 token 只应在当前网站打开期间生效，所以将 token 保存在 sessionStorage 中
    window.sessionStorage.setItem('token', data.data.token)
    // 2. 通过编程式导航跳转到后台主页，路由地址是 /home
    proxy.$router.push('/home')
  })
}
</script>

<style lang='less' scoped>

.login_container {
  background-color: #2b4b6b;
  height: 100%;
}

.login_box {
  height: 300px;
  width: 450px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  .avatar_box {
    height: 130px;
    width: 130px;
    border-radius: 50%;
    border: 1px solid #eee;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    margin: -76px auto;
    background-color: #fff;
    img {
      height: 130px;
      width: 130px;
      border-radius: 50%;
      background-color: #eee;
    }
  }
}

.btns {
  display: flex;
  justify-content: flex-end;
  /deep/.el-form-item__content {
    flex: unset;
  }
}

.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 10px;
  box-sizing: border-box;
}
</style>
