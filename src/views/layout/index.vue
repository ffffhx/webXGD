<template>
    <el-container class="layout-container">
      <!-- 顶部栏 -->
      <el-header class="layout-header">
        <LayoutTop />
      </el-header>
  
      <!-- 内容区域 -->
      <el-container class="layout-body">
        <!-- 侧边栏 -->
        <el-aside width="200px" class="layout-aside">
          <LayoutSider />
        </el-aside>
  
        <!-- 页面主体 -->
        <el-main class="layout-main">
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </template>
  
  <script setup>
  import LayoutTop from './main/LayoutTop.vue'
  import LayoutSider from './main/LayoutSide.vue'
  </script>
  
  <style scoped>
  .layout-container {
    height: 100%;
    width: 100em;
  }
  
  .layout-header {
    height: 60px;
    padding: 0;
    width: 100%;
  }
  
  .layout-body {
    height: calc(100% - 60px); /* 减去顶部高度 */
    width: 100%;

  }
  
  .layout-aside {
    height: 100%;
  }
  
  .layout-main {
    height: 100%;

    overflow: auto;
    background-color: #f5f5f5;
    width: 100%;
  }
  </style>
  