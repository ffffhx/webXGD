<template>
    <el-menu
      :default-active="$route.path"
      class="el-menu-vertical-demo"
      router
      @select="handleSelect"
    >
      <el-sub-menu index="1">
        <template #title><span>班级学员管理</span></template>
        <el-menu-item index="/class">班级管理</el-menu-item>
        <el-menu-item index="/student">学员管理</el-menu-item>
      </el-sub-menu>
  
      <el-sub-menu index="2">
        <template #title><span>系统信息管理</span></template>
        <el-menu-item index="/department">部门管理</el-menu-item>
        <el-menu-item index="/staff">员工管理</el-menu-item>
      </el-sub-menu>
  
      <el-sub-menu index="3">
        <template #title><span>数据统计管理</span></template>
        <el-menu-item index="/statistics">员工信息统计</el-menu-item>
      </el-sub-menu>
    </el-menu>
  </template>
  
  <script lang="ts" setup>
  import { useRouter } from 'vue-router'
  const router = useRouter()
  
  const handleSelect = (index: string) => {
    router.push(index)
  }
  </script>
  
  <style scoped>
  .el-menu-vertical-demo {
    height: 100%;
    border-right: none;
  }
  </style>
  