<template>
  <div class="login-wrapper">
    <div class="login-container">
      <el-form :model="form" class="login-form" label-width="80px">
        <el-form-item label="用户名">
          <el-input v-model="form.username" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="密码">
          <el-input type="password" v-model="form.password" placeholder="请输入密码" show-password />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleLogin" style="width: 100%">登录</el-button>
        </el-form-item>
        <el-form-item style="text-align: right">
          <el-button type="link">去注册</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import Swal from 'sweetalert2'
const router = useRouter()
const form = reactive({
  username: '',
  password: ''
})

import { ElMessage } from 'element-plus'
import request from '@/utils/request.ts'

const handleLogin = () => {
  if (!form.username || !form.password) {
    Swal.fire({
      icon: 'error',
      title: '用户名或密码不能为空',
      showConfirmButton: false,
      timer: 1500
    })
    return
  }

  request.post('/login', {
    username: form.username,
    password: form.password
  }).then((res) => {
    console.log(res, 'res');
    if (res.code === 1) {
      localStorage.setItem('token', res.data)
      console.log('登录成功');
      router.push('class')
      Swal.fire({
        icon: 'success',
        title: '登录成功',
        showConfirmButton: false,
        timer: 1500
      })
    }
  }).catch(err => {
    console.log(err, 'err');

  })

}


</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.login-form {
  width: 400px;
  padding: 40px;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  background-color: white;
}

.login-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100em;
}
</style>
