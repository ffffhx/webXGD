<template>
    <el-header class="layout-top">
      <div class="top-left">信息管理系统</div>
      <div class="top-right">
        <el-button type="text" @click="handleChangePassword">修改密码</el-button>
        <el-button type="text" @click="handleLogout">退出登录</el-button>
      </div>
    </el-header>
  </template>
  
  <script lang="ts" setup>
  const handleChangePassword = () => {
    // 在这里处理跳转修改密码页面或弹窗
    console.log('修改密码')
  }
  
  const handleLogout = () => {
    // 清除登录信息并跳转登录页
    localStorage.removeItem('token')
    window.location.href = '/login'
  }
  </script>
  
  <style scoped>
  .layout-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
    height: 60px;
    background-color: #ffffff;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    width: 100%;
  }
  
  .top-left {
    font-size: 20px;
    font-weight: bold;
    color: #000;
  }
  
  .top-right > * {
    margin-left: 10px;
  }
  </style>
  