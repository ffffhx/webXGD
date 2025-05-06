<template>
    <!-- 查询条件 -->
    <el-form :model="form" inline>
      <el-form-item label="姓名">
        <el-input v-model="form.name" placeholder="请输入姓名" />
      </el-form-item>
      <el-form-item label="性别">
        <el-select v-model="form.gender" placeholder="请选择">
          <el-option label="男" value="男" />
          <el-option label="女" value="女" />
        </el-select>
      </el-form-item>
      <el-form-item label="入职时间">
        <el-date-picker v-model="form.entryDate" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSearch">查询</el-button>
      </el-form-item>
    </el-form>
  
    <!-- 操作按钮 -->
    <div style="margin-bottom: 10px;">
      <el-button type="primary" @click="openDialog('add')">新增员工</el-button>
      <el-button type="danger" :disabled="!multipleSelection.length" @click="batchDelete">批量删除</el-button>
    </div>
  
    <!-- 表格 -->
    <el-table :data="tableData" border style="width: 100%" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" />
      <el-table-column type="index" label="序号" width="60" />
      <el-table-column prop="name" label="姓名" />
      <el-table-column label="图像" width="100">
        <template #default="{ row }">
          <el-image :src="row.avatar" style="width: 60px; height: 60px" v-if="row.avatar" />
          <span v-else>无</span>
        </template>
      </el-table-column>
      <el-table-column prop="gender" label="性别" />
      <el-table-column prop="position" label="职位" />
      <el-table-column prop="entryDate" label="入职日期" />
      <el-table-column prop="lastOperate" label="最后操作时间" />
      <el-table-column label="操作" width="180">
        <template #default="{ row }">
          <el-button type="primary" size="small" @click="openDialog('edit', row)">编辑</el-button>
          <el-button type="danger" size="small" @click="onDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  
    <!-- 新增/编辑员工弹窗 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="600px">
      <el-form :model="dialogForm" label-width="100px" :rules="rules" ref="formRef">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="dialogForm.username" />
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="dialogForm.name" />
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-select v-model="dialogForm.gender" placeholder="请选择">
            <el-option label="男" value="男" />
            <el-option label="女" value="女" />
          </el-select>
        </el-form-item>
        <el-form-item label="图像">
          <el-upload
            class="avatar-uploader"
            :action="uploadUrl"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="dialogForm.avatar" :src="dialogForm.avatar" class="avatar" />
            <el-icon v-else><Plus /></el-icon>
          </el-upload>
        </el-form-item>
        <el-form-item label="职位">
          <el-input v-model="dialogForm.position" />
        </el-form-item>
        <el-form-item label="入职日期">
          <el-date-picker v-model="dialogForm.entryDate" type="date" />
        </el-form-item>
        <el-form-item label="归属部门">
          <el-input v-model="dialogForm.department" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确认</el-button>
      </template>
    </el-dialog>
  </template>
  
  <script setup lang="ts">
  import { ref, reactive } from 'vue'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import type { UploadProps } from 'element-plus'
  
  const form = reactive({
    name: '',
    gender: '',
    entryDate: []
  })
  
  const tableData = ref<any[]>([])
  const multipleSelection = ref<any[]>([])
  
  const onSearch = () => {
    console.log('查询:', form)
  }
  
  const handleSelectionChange = (val: any[]) => {
    multipleSelection.value = val
  }
  
  const batchDelete = () => {
    ElMessageBox.confirm('确认删除选中的员工？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      tableData.value = tableData.value.filter(item => !multipleSelection.value.includes(item))
      ElMessage.success('删除成功')
    })
  }
  
  // 弹窗逻辑
  const dialogVisible = ref(false)
  const dialogTitle = ref('')
  const formRef = ref()
  const uploadUrl = 'https://mock-upload-url.com/upload'
  
  const dialogForm = reactive<any>({
    username: '',
    name: '',
    gender: '',
    avatar: '',
    position: '',
    entryDate: '',
    department: ''
  })
  
  const rules = {
    username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
    name: [{ required: true, message: '请输入员工姓名', trigger: 'blur' }],
    gender: [{ required: true, message: '请选择性别', trigger: 'change' }]
  }
  
  const openDialog = (type: 'add' | 'edit', row?: any) => {
    dialogTitle.value = type === 'add' ? '新增员工' : '编辑员工'
    if (type === 'edit' && row) {
      Object.assign(dialogForm, row)
    } else {
      Object.assign(dialogForm, {
        username: '',
        name: '',
        gender: '',
        avatar: '',
        position: '',
        entryDate: '',
        department: ''
      })
    }
    dialogVisible.value = true
  }
  
  const handleSubmit = () => {
    formRef.value.validate((valid: boolean) => {
      if (valid) {
        if (dialogTitle.value === '新增员工') {
          tableData.value.unshift({ ...dialogForm, lastOperate: new Date().toLocaleString() })
        } else {
          const idx = tableData.value.findIndex(item => item.username === dialogForm.username)
          if (idx !== -1) tableData.value[idx] = { ...dialogForm, lastOperate: new Date().toLocaleString() }
        }
        dialogVisible.value = false
        ElMessage.success('提交成功')
      }
    })
  }
  
  const onDelete = (row: any) => {
    ElMessageBox.confirm(`确认删除员工 ${row.name} 吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      tableData.value = tableData.value.filter(item => item !== row)
      ElMessage.success('删除成功')
    })
  }
  
  // 上传图片逻辑
  const handleAvatarSuccess: UploadProps['onSuccess'] = (response, file) => {
    dialogForm.avatar = URL.createObjectURL(file.raw!)
  }
  
  const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
    const isJpgOrPng = rawFile.type === 'image/jpeg' || rawFile.type === 'image/png' || rawFile.type === 'image/jpg'
    const isLt2M = rawFile.size / 1024 / 1024 < 2
  
    if (!isJpgOrPng) {
      ElMessage.error('格式错误，上传失败')
      return false
    }
    if (!isLt2M) {
      ElMessage.error('图片过大，上传失败')
      return false
    }
    return true
  }
  </script>
  
  <style scoped>
  .avatar-uploader {
    display: inline-block;
    width: 100px;
    height: 100px;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    overflow: hidden;
    text-align: center;
    line-height: 100px;
  }
  
  .avatar-uploader img.avatar {
    width: 100%;
    height: 100%;
    display: block;
  }
  </style>
  