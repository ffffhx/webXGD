<template>
  <div class="wrapper">
    <div class="register-container">
      <el-form :model="form" class="register-form" label-width="80px">
        <el-form-item label="用户名">
          <el-input v-model="form.username" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="密码">
          <el-input type="password" v-model="form.password" placeholder="请输入密码" show-password />
        </el-form-item>
        <el-form-item label="确认密码">
          <el-input type="password" v-model="form.confirmPassword" placeholder="请确认密码" show-password />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleRegister" style="width: 100%">注册</el-button>
        </el-form-item>
        <el-form-item style="text-align: right">
          <el-button type="text" @click="goToLogin">已有账号？去登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>  
  </template>
  
  <script setup lang="ts">
  import { reactive } from 'vue'
  import { useRouter } from 'vue-router'
  
  const router = useRouter()
  const form = reactive({
    username: '',
    password: '',
    confirmPassword: ''
  })
  
  const handleRegister = () => {
    // 注册逻辑（自行对接接口）
    if (form.password !== form.confirmPassword) {
      alert('两次密码不一致')
      return
    }
    console.log('注册中...', form)
  }
  
  const goToLogin = () => {
    router.push('/login')
  }
  </script>
  
  <style scoped>
  .register-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
  }
  .register-form {
    width: 400px;
    padding: 40px;
    border: 1px solid #ddd;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    background-color: white;
  }
  .wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100em;
}
  </style>
  